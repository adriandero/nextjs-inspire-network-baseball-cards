export const ASSESSMENT_TYPES = {
  VALUES: "values",
  WORKING_GENIUS: "workingGenius",
  PRINCIPLES_YOU: "principlesYou",
  KOLBE: "kolbe",
} as const;

export type AssessmentType =
  (typeof ASSESSMENT_TYPES)[keyof typeof ASSESSMENT_TYPES];

export const ASSESSMENT_FIELD_MAP: Record<AssessmentType, string> = {
  [ASSESSMENT_TYPES.VALUES]: "valuesAssessmentPdf",
  [ASSESSMENT_TYPES.WORKING_GENIUS]: "workingGeniusAssessmentPdf",
  [ASSESSMENT_TYPES.PRINCIPLES_YOU]: "principlesYouAssessmentPdf",
  [ASSESSMENT_TYPES.KOLBE]: "kolbeAssessmentPdf",
};

