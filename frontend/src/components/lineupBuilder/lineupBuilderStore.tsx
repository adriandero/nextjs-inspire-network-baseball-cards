export enum CompareType {
  WORKING_GENIUS = "workinggenius",
  KOLBE_STRENGTHS = "kolbestrengths",
  KOLBE_GRAPH = "kolbegraph",
  VALUES = "values",
}
export class LineupBuilderStore {
  // Proper class naming convention (PascalCase)
  private currentCompareType: CompareType | null = null;

  COMPARE_TYPE_LABELS: Record<CompareType, string> = {
    [CompareType.WORKING_GENIUS]: "Working Genius",
    [CompareType.KOLBE_STRENGTHS]: "Kolbe Strengths",
    [CompareType.KOLBE_GRAPH]: "Kolbe Graph",
    [CompareType.VALUES]: "Values",
  };

  compareTypes = Object.entries(this.COMPARE_TYPE_LABELS).map(
    ([value, label]) => ({
      value: value as CompareType,
      label,
    })
  );

  // Add methods to manage state
  setCompareType(type: CompareType): void {
    this.currentCompareType = type;
  }

  getCompareType(): CompareType | null {
    return this.currentCompareType;
  }

  getCompareTypeLabel(): string | null {
    return this.currentCompareType
      ? this.COMPARE_TYPE_LABELS[this.currentCompareType]
      : null;
  }
}

// Create a singleton instance
export const lineupBuilderStoreInstance = new LineupBuilderStore();
