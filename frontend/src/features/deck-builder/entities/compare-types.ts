export enum CompareTypes {
  WORKING_GENIUS = "workinggenius",
  KOLBE_STRENGTHS = "kolbestrengths",
  KOLBE_GRAPH = "kolbegraph",
  VALUES = "values",
  SIDE_BY_SIDE = "sidebyside",
  PRINCIPLES_YOU_ARCHETYPES = "principlesyouarchetypes",
  PRINCIPLES_YOU_ARCHETYPES_GRAPH = "principlesyouarchetypesgraph",
}

export enum AvailableFilter {
  ShowJobRole = "showJobRole",
  Archetypes = "archetypes",
  ShowPrimaryOnly = "showPrimaryOnly",
}

export const COMPARISON_ATTRIBUTES: Record<
  CompareTypes,
  {
    title: string;
    slug: string;
    availableFilters?: AvailableFilter[];
    componentProps?: AvailableFilter[];
  }
> = {
  [CompareTypes.WORKING_GENIUS]: {
    title: "Working Genius",
    slug: "workinggenius",
    availableFilters: [AvailableFilter.ShowJobRole],
    componentProps: [AvailableFilter.ShowJobRole],
  },
  [CompareTypes.KOLBE_STRENGTHS]: {
    title: "Kolbe Strengths",
    slug: "kolbestrengths",
    availableFilters: [AvailableFilter.ShowJobRole],
    componentProps: [AvailableFilter.ShowJobRole],
  },
  [CompareTypes.KOLBE_GRAPH]: {
    title: "Kolbe Graph",
    slug: "kolbegraph",
    availableFilters: undefined,
  },
  [CompareTypes.VALUES]: {
    title: "Values",
    slug: "values",
    availableFilters: [AvailableFilter.ShowJobRole],
    componentProps: [AvailableFilter.ShowJobRole],
  },
  [CompareTypes.SIDE_BY_SIDE]: {
    title: "Side by Side",
    slug: "sidebyside",
    availableFilters: [AvailableFilter.ShowJobRole],
    componentProps: [AvailableFilter.ShowJobRole],
  },
  [CompareTypes.PRINCIPLES_YOU_ARCHETYPES]: {
    title: "PrinciplesYou Archetypes",
    slug: "principlesyouarchetypes",
    availableFilters: [AvailableFilter.Archetypes, AvailableFilter.ShowJobRole],
    componentProps: [AvailableFilter.ShowJobRole],
  },
  [CompareTypes.PRINCIPLES_YOU_ARCHETYPES_GRAPH]: {
    title: "PrinciplesYou Graph",
    slug: "principlesyouarchetypesgraph",
    availableFilters: [AvailableFilter.ShowPrimaryOnly],
    componentProps: [AvailableFilter.ShowPrimaryOnly],
  },
} as const;

export const COMPARE_TYPE_OPTIONS = Object.entries(COMPARISON_ATTRIBUTES).map(
  ([value, data]) => ({
    value: value as CompareTypes,
    data,
  }),
);
