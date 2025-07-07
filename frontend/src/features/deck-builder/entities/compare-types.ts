export enum CompareTypes {
  WORKING_GENIUS = "workinggenius",
  KOLBE_STRENGTHS = "kolbestrengths",
  KOLBE_GRAPH = "kolbegraph",
  VALUES = "values",
  SIDE_BY_SIDE = "sidebyside",
  PRINCIPLES_YOU_ARCHETYPES = "principlesyouarchetypes",
}

export const COMPARISON_ATTRIBUTES = {
  [CompareTypes.WORKING_GENIUS]: {
    title: "Working Genius",
    slug: "workinggenius",
  },
  [CompareTypes.KOLBE_STRENGTHS]: {
    title: "Kolbe Strengths",
    slug: "kolbestrengths",
  },
  [CompareTypes.KOLBE_GRAPH]: {
    title: "Kolbe Graph",
    slug: "kolbegraph",
  },
  [CompareTypes.VALUES]: {
    title: "Values",
    slug: "values",
  },
  [CompareTypes.SIDE_BY_SIDE]: {
    title: "Side by Side",
    slug: "sidebyside",
  },
  [CompareTypes.PRINCIPLES_YOU_ARCHETYPES]: {
    title: "PrinciplesYou Archetypes",
    slug: "principlesyouarchetypes",
  },
} as const;

export const COMPARE_TYPE_OPTIONS = Object.entries(COMPARISON_ATTRIBUTES).map(
  ([value, data]) => ({
    value: value as CompareTypes,
    data,
  }),
);

// Helper functions if needed
export const getComparisonConfig = (type: CompareTypes) => {
  return COMPARISON_ATTRIBUTES[type];
};

export const getComparisonSlug = (type: CompareTypes) => {
  return COMPARISON_ATTRIBUTES[type].slug;
};

export const getComparisonTitle = (type: CompareTypes) => {
  return COMPARISON_ATTRIBUTES[type].title;
};
