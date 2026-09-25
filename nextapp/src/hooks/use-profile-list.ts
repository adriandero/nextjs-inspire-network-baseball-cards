"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getProfilesPage } from "@/src/lib/api/profiles";
import { CursorPage } from "@/src/shared/entities/pagination.types";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";
import {
  normalizeProfileSearch,
  profileListKey,
  ProfileListOptions,
} from "@/src/shared/entities/profile-list.types";

type Page = CursorPage<ProfileWithDetailedTeams>;
type Result = {
  key: string;
  page: Page | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
};
const CACHE_TTL = 30_000;
const CACHE_SIZE = 20;

/** Component-local cache, discarded when the list unmounts. */
export function useProfileList(options: ProfileListOptions, enabled = true) {
  const search = normalizeProfileSearch(options.search);
  const group = options.group || "";
  const sort = options.sort || "name-asc";
  const key = profileListKey({ search, group, sort });
  const cache = useRef(new Map<string, { page: Page; time: number }>());
  const generation = useRef(0);
  const moreRequest = useRef<AbortController | null>(null);
  const [knownProfiles, setKnownProfiles] = useState<
    ProfileWithDetailedTeams[]
  >([]);
  const [retryVersion, setRetryVersion] = useState(0);
  const [result, setResult] = useState<Result>({
    key: "",
    page: null,
    loading: false,
    loadingMore: false,
    error: null,
  });

  const remember = useCallback((queryKey: string, page: Page) => {
    cache.current.delete(queryKey);
    cache.current.set(queryKey, { page, time: Date.now() });
    if (cache.current.size > CACHE_SIZE)
      cache.current.delete(cache.current.keys().next().value!);
    // Keep selected deck cards available when they disappear from search results.
    setKnownProfiles((current) => {
      const profiles = new Map(
        current.map((profile) => [profile._id, profile]),
      );
      page.data.forEach((profile) => profiles.set(profile._id, profile));
      return [...profiles.values()];
    });
  }, []);

  useEffect(() => {
    const version = ++generation.current;
    const controller = new AbortController();
    moreRequest.current?.abort();
    moreRequest.current = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (enabled) {
      const cached = cache.current.get(key);
      if (cached && Date.now() - cached.time < CACHE_TTL) {
        setResult({
          key,
          page: cached.page,
          loading: false,
          loadingMore: false,
          error: null,
        });
      } else {
        setResult({
          key,
          page: null,
          loading: true,
          loadingMore: false,
          error: null,
        });
        timer = setTimeout(
          async () => {
            try {
              const page = await getProfilesPage(
                null,
                50,
                { search, group, sort },
                controller.signal,
              );
              if (controller.signal.aborted || generation.current !== version)
                return;
              remember(key, page);
              setResult({
                key,
                page,
                loading: false,
                loadingMore: false,
                error: null,
              });
            } catch (error) {
              if (controller.signal.aborted || generation.current !== version)
                return;
              setResult({
                key,
                page: null,
                loading: false,
                loadingMore: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Unable to search profiles",
              });
            }
          },
          search ? 180 : 0,
        );
      }
    }
    return () => {
      clearTimeout(timer);
      controller.abort();
      moreRequest.current?.abort();
    };
  }, [enabled, key, search, group, sort, retryVersion, remember]);

  const cached = cache.current.get(key);
  const cachedPage =
    cached && Date.now() - cached.time < CACHE_TTL ? cached.page : null;
  const page = result.key === key ? result.page : cachedPage;
  const isSearching =
    enabled && (result.key === key ? result.loading : !cachedPage);
  const isLoadingMore = enabled && result.key === key && result.loadingMore;
  const error = enabled && result.key === key ? result.error : null;
  const profiles = useMemo(() => {
    if (page) return page.data;
    const matches = knownProfiles.filter(
      (profile) =>
        (profile.name || "").toLowerCase().includes(search) &&
        (!group || profile.teams?.some((team) => team.groups === group)),
    );
    return matches.sort((a, b) => {
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      const comparison = aName < bName ? -1 : aName > bName ? 1 : 0;
      return (
        (sort === "id" ? 0 : sort === "name-desc" ? -comparison : comparison) ||
        (a._id < b._id ? -1 : a._id > b._id ? 1 : 0)
      );
    });
  }, [page, knownProfiles, search, group, sort]);

  const loadMore = useCallback(async () => {
    if (
      !enabled ||
      isSearching ||
      !page?.hasMore ||
      !page.nextCursor ||
      moreRequest.current
    )
      return;
    const controller = new AbortController();
    moreRequest.current = controller;
    const version = generation.current;
    setResult({ key, page, loading: false, loadingMore: true, error: null });
    try {
      const next = await getProfilesPage(
        page.nextCursor,
        50,
        { search, group, sort },
        controller.signal,
      );
      if (controller.signal.aborted || version !== generation.current) return;
      const profiles = new Map(
        page.data.map((profile) => [profile._id, profile]),
      );
      next.data.forEach((profile) => profiles.set(profile._id, profile));
      const combined = { ...next, data: [...profiles.values()] };
      remember(key, combined);
      setResult({
        key,
        page: combined,
        loading: false,
        loadingMore: false,
        error: null,
      });
    } catch (error) {
      if (controller.signal.aborted || version !== generation.current) return;
      setResult({
        key,
        page,
        loading: false,
        loadingMore: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load more profiles",
      });
    } finally {
      if (moreRequest.current === controller) moreRequest.current = null;
    }
  }, [enabled, isSearching, page, key, search, group, sort, remember]);

  const retry = useCallback(() => {
    cache.current.delete(key);
    setRetryVersion((current) => current + 1);
  }, [key]);

  return {
    profiles,
    knownProfiles,
    isSearching,
    isLoadingMore,
    error,
    loadMore,
    retry,
    hasMore: !isSearching && !!page?.hasMore,
    queryKey: key,
  };
}
