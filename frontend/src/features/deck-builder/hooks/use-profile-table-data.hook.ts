import { useMemo } from "react";
import { SanityDocument } from "next-sanity";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";

export function useProfileTableData(
  profileTables: ProfileIdentifierTable[],
  allProfiles: SanityDocument[],
) {
  const profilesMap = useMemo(() => {
    return new Map(allProfiles.map((profile) => [profile.uuid, profile]));
  }, [allProfiles]);

  const getProfilesForTable = useMemo(() => {
    return (tableId: string): SanityDocument[] => {
      const table = profileTables.find((t) => t.id === tableId);
      if (!table) return [];

      return table.profiles
        .map((uuid) => profilesMap.get(uuid))
        .filter((profile): profile is SanityDocument => profile !== undefined);
    };
  }, [profileTables, profilesMap]);

  return { getProfilesForTable };
}
