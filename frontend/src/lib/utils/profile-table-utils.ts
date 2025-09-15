import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { Profile } from "@/src/lib/entities/profile";

export function parseProfileTablesFromURL(
  paramString: string,
): ProfileIdentifierTable[] {
  if (!paramString) return [];

  return paramString.split(";").map((groupString) => {
    const [nameEncoded, id, profilesString] = groupString.split(":");
    return {
      id,
      name: decodeURIComponent(nameEncoded),
      profiles: profilesString ? profilesString.split(",") : [],
    };
  });
}

export function addProfileToTable(
  table: ProfileIdentifierTable,
  profileId: string,
): ProfileIdentifierTable {
  if (table.profiles.includes(profileId)) {
    return table;
  }

  return {
    ...table,
    profiles: [...table.profiles, profileId],
  };
}

export function removeProfileFromTable(
  table: ProfileIdentifierTable,
  profileId: string,
): ProfileIdentifierTable {
  return {
    ...table,
    profiles: table.profiles.filter((id) => id !== profileId),
  };
}

export function toggleProfileInTable(
  table: ProfileIdentifierTable,
  profileId: string,
): ProfileIdentifierTable {
  const hasProfile = table.profiles.includes(profileId);
  return hasProfile
    ? removeProfileFromTable(table, profileId)
    : addProfileToTable(table, profileId);
}

/**
 * Transforms profile names to show first name + last initial
 * e.g., "John Smith" becomes "John S."
 */
export function shortNamesOfProfiles(profiles: Profile[]) {
  return profiles.map((profile) => {
    const nameParts = profile.name.split(" ");

    if (nameParts.length === 1) {
      // Handle single names
      return profile;
    }

    const firstName = nameParts.slice(0, -1).join(" ");
    const lastInitial = nameParts[nameParts.length - 1][0] + ".";
    const transformedName = `${firstName} ${lastInitial}`;

    return {
      ...profile,
      name: transformedName,
    };
  });
}
