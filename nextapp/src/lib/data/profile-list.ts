import { decodeCursor } from "./pagination";
import {
  normalizeProfileSearch,
  profileListKey,
  ProfileListOptions,
} from "@/src/shared/entities/profile-list.types";

export type ProfileNameCursor = { id: string; name: string; key: string };

export function parseProfileListOptions(
  params: URLSearchParams,
): ProfileListOptions {
  const search = normalizeProfileSearch(params.get("search") ?? "");
  const group = params.get("group") || "";
  const sort = params.get("sort") || "id";
  if (search.length > 200)
    throw new Error("search must be at most 200 characters");
  if (group && !["client", "egf", "prospect"].includes(group)) {
    throw new Error("group is invalid");
  }
  if (sort !== "id" && sort !== "name-asc" && sort !== "name-desc") {
    throw new Error("sort is invalid");
  }
  return { search, group, sort };
}

export function decodeProfileCursor(
  raw: string | null,
  options: ProfileListOptions,
): string | ProfileNameCursor | null {
  if (!raw) return null;
  if (!options.sort || options.sort === "id") return decodeCursor(raw);
  try {
    if (raw.length > 8192) throw new Error();
    const cursor = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (
      typeof cursor.id !== "string" ||
      !/^[A-Za-z0-9._-]+$/.test(cursor.id) ||
      typeof cursor.name !== "string" ||
      cursor.key !== profileListKey(options)
    )
      throw new Error();
    return cursor;
  } catch {
    throw new Error("cursor is invalid for this search");
  }
}
