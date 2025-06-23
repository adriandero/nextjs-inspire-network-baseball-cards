import { CompareType } from "@/src/features/deck-builder/types/compare-type";

export class DeckBuilderStore {
  // Proper class naming convention (PascalCase)
  private currentCompareType: CompareType | null = null;

  comparisonAttributesMap = {
    [CompareType.WORKING_GENIUS]: {
      title: "Working Genius",
      slug: "workinggenius",
    },
    [CompareType.KOLBE_STRENGTHS]: {
      title: "Kolbe Strengths",
      slug: "kolbestrengths",
    },
    [CompareType.KOLBE_GRAPH]: {
      title: "Kolbe Graph",
      slug: "kolbegraph",
    },
    [CompareType.VALUES]: {
      title: "Values",
      slug: "values",
    },
    [CompareType.SIDE_BY_SIDE]: {
      title: "Side by Side",
      slug: "sidebyside",
    },
    [CompareType.PRINCIPLES_YOU_ARCHETYPES]: {
      title: "PrinciplesYou Archetypes",
      slug: "principlesyouarchetypes",
    },
  };

  compareTypes = Object.entries(this.comparisonAttributesMap).map(
    ([value, data]) => ({
      value: value as CompareType,
      data,
    }),
  );

  // Add methods to manage state
  setCompareType(type: CompareType): void {
    this.currentCompareType = type;
  }

  getCompareType(): CompareType | null {
    return this.currentCompareType;
  }
}

// Create a singleton instance
export const deckBuilderStoreInstance = new DeckBuilderStore();
