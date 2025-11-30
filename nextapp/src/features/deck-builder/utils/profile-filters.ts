import { Profile } from "@/src/shared/entities/profile";

export interface ProfileFilterOptions {
  selectedArchetypes?: string[];
}

/**
 * Filters profiles based on their primary PrinciplesYou archetype
 * @param profiles - Array of profiles to filter
 * @param options - Filter options including selected archetypes
 * @returns Filtered array of profiles
 */
export function filterProfilesByArchetype(
  profiles: Profile[],
  options: ProfileFilterOptions = {}
): Profile[] {
  const { selectedArchetypes = [] } = options;

  // If no filters selected, return all profiles
  if (selectedArchetypes.length === 0) {
    return profiles;
  }

  return profiles.filter((profile) => {
    // Check if profile has principleYouArchetype and it's not empty
    if (
      !profile.principleYouArchetype ||
      profile.principleYouArchetype.length === 0
    ) {
      return false;
    }

    // Get the primary archetype (first in the array)
    const primaryArchetype = profile.principleYouArchetype[0];

    // Check if primary archetype matches any selected filter
    return selectedArchetypes.includes(primaryArchetype);
  });
}

/**
 * Gets the count of profiles for each archetype filter
 * Useful for showing counts in the UI
 */
export function getArchetypeFilterCounts(
  profiles: Profile[],
  availableArchetypes: string[]
): Record<string, number> {
  const counts: Record<string, number> = {};

  availableArchetypes.forEach((archetype) => {
    counts[archetype] = profiles.filter(
      (profile) => profile.principleYouArchetype?.[0] === archetype
    ).length;
  });

  return counts;
}
