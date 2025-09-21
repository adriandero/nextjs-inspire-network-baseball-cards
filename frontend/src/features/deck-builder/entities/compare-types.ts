export enum CompareTypes {
  WORKING_GENIUS = "workinggenius",
  KOLBE_STRENGTHS = "kolbestrengths",
  KOLBE_GRAPH = "kolbegraph",
  VALUES = "values",
  SIDE_BY_SIDE = "sidebyside",
  PRINCIPLES_YOU_ARCHETYPES = "principlesyouarchetypes",
  PRINCIPLES_YOU_ARCHETYPES_GRAPH = "principlesyouarchetypesgraph"
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
  [CompareTypes.PRINCIPLES_YOU_ARCHETYPES_GRAPH]: {
    title: "PrinciplesYou Graph",
    slug: "principlesyouarchetypesgraph"
  }
} as const;

export const COMPARE_TYPE_OPTIONS = Object.entries(COMPARISON_ATTRIBUTES).map(
  ([value, data]) => ({
    value: value as CompareTypes,
    data,
  }),
);
