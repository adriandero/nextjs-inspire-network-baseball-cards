import { useMemo, useRef } from "react";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";

export function useProfileTableData(
  profileTables: ProfileIdentifierTable[],
  allProfiles: ProfileWithDetailedTeams[]
) {
  const profilesMap = useMemo(() => {
    return new Map(allProfiles.map((profile) => [profile.uuid, profile]));
  }, [allProfiles]);

  const cachedProfiles = useRef(
    new Map<string, { ids: string; profiles: ProfileWithDetailedTeams[] }>(),
  );

  const getProfilesForTable = useMemo(() => {
    return (tableId: string): ProfileWithDetailedTeams[] => {
      const table = profileTables.find((t) => t.id === tableId);
      if (!table) return [];

      const ids = table.profiles.join("\u0000");
      const cached = cachedProfiles.current.get(tableId);
      if (cached?.ids === ids && cached.profiles.every((profile) => profilesMap.get(profile.uuid) === profile)) {
        return cached.profiles;
      }

      const profiles = table.profiles
        .map((uuid) => profilesMap.get(uuid))
        .filter(
          (profile): profile is ProfileWithDetailedTeams =>
            profile !== undefined
        );
      cachedProfiles.current.set(tableId, { ids, profiles });
      return profiles;
    };
  }, [profileTables, profilesMap]);

  return { getProfilesForTable };
}
