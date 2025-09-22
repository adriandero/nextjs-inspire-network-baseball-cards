import {
  AvailableFilter,
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import { Profile } from "@/src/lib/entities/profile";
import { useEffect, useState } from "react";
import { filterProfilesByArchetype } from "@/src/features/deck-builder/utils/profile-filters";

export interface UsedFilters {
  showJobRole?: boolean;
  selectedArchetypes?: string[];
  showPrimaryOnly?: boolean;
}

export function useComparisonFilters(selectedType: CompareTypes) {
  const [showJobRole, setShowJobRole] = useState(false);
  const [selectedArchetypes, setSelectedArchetypes] = useState<string[]>([]);
  const [showPrimaryOnly, setShowPrimaryOnly] = useState(false);

  // Reset type-specific filters when type changes
  useEffect(() => {
    const availableFilters =
      COMPARISON_ATTRIBUTES[selectedType].availableFilters;

    if (!availableFilters?.includes(AvailableFilter.Archetypes)) {
      setSelectedArchetypes([]);
    }
    if (!availableFilters?.includes(AvailableFilter.ShowPrimaryOnly)) {
      setShowPrimaryOnly(false);
    }
  }, [selectedType]);

  // Apply filtering logic
  const applyFilters = (profiles: Profile[]) => {
    let filtered = profiles;

    if (selectedType === CompareTypes.PRINCIPLES_YOU_ARCHETYPES) {
      filtered = filterProfilesByArchetype(filtered, { selectedArchetypes });
    }

    // Add your showPrimaryOnly logic here when ready

    return filtered;
  };

  return {
    filters: { showJobRole, selectedArchetypes, showPrimaryOnly },
    setters: { setShowJobRole, setSelectedArchetypes, setShowPrimaryOnly },
    applyFilters,
    availableFilters: COMPARISON_ATTRIBUTES[selectedType].availableFilters,
  };
}
