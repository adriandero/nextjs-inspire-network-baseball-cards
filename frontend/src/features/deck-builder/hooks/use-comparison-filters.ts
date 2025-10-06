import {
  AvailableFilter,
  CompareTypes,
  COMPARISON_ATTRIBUTES,
} from "@/src/features/deck-builder/entities/compare-types";
import { Profile } from "@/src/lib/entities/profile";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  // ✅ Memoize the filters object
  const filters = useMemo(
    () => ({
      showJobRole,
      selectedArchetypes,
      showPrimaryOnly,
    }),
    [showJobRole, selectedArchetypes, showPrimaryOnly],
  );

  // ✅ Memoize the setters object
  const setters = useMemo(
    () => ({
      setShowJobRole,
      setSelectedArchetypes,
      setShowPrimaryOnly,
    }),
    [],
  ); // These never change

  const applyFilters = useCallback(
    (profiles: Profile[]) => {
      let filtered = profiles;

      if (selectedType === CompareTypes.PRINCIPLES_YOU_ARCHETYPES) {
        filtered = filterProfilesByArchetype(filtered, { selectedArchetypes });
      }

      return filtered;
    },
    [selectedType, selectedArchetypes],
  );

  return {
    filters,
    setters,
    applyFilters,
    availableFilters: COMPARISON_ATTRIBUTES[selectedType].availableFilters,
  };
}
