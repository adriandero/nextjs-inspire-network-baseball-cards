import { useMemo } from "react";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile";

export function useProfileTableData(
  profileTables: ProfileIdentifierTable[],
  allProfiles: ProfileWithDetailedTeams[]
) {
  const profilesMap = useMemo(() => {
    return new Map(allProfiles.map((profile) => [profile.uuid, profile]));
  }, [allProfiles]);

  const getProfilesForTable = useMemo(() => {
    return (tableId: string): ProfileWithDetailedTeams[] => {
      const table = profileTables.find((t) => t.id === tableId);
      if (!table) return [];

      return table.profiles
        .map((uuid) => profilesMap.get(uuid))
        .filter(
          (profile): profile is ProfileWithDetailedTeams =>
            profile !== undefined
        );
    };
  }, [profileTables, profilesMap]);

  return { getProfilesForTable };
}
