// lib/sanity/extraction-schema.ts

import { ExtractionSchema } from "@/src/shared/entities/extraction.types";
import { principleYouArchetypeList } from "./principle-you-archetype.types";

const principleYouArchetypeValues = principleYouArchetypeList.map(
  (item) => item.value
);

export const DOCUMENT_EXTRACTION_SCHEMAS: Record<string, ExtractionSchema> = {
  profile: {
    principleYouArchetype: {
      type: "array",
      description: `Extract the EXACT 3 "Most like" Principle You archetypes explicitly stated in the PDF.
Rules:
- DO NOT infer from descriptions, strengths, talents, or growth needs.
- ONLY use the report’s explicit result statements, typically:
  1) "You are most like The <Archetype>" (this is the #1 archetype)
  2) "You also have attributes of the <Archetype> and the <Archetype>" (these are #2 and #3)
- Return exactly 3 items, mapped to the closest matching allowedValues.
- If the report uses title-case names like "The Growth Seeker", map them to the corresponding allowed value (e.g. "growthSeeker" / "growth_seeker" depending on allowedValues).
- If you cannot find explicit "most like" statements, return an empty array (do not guess).`,
      allowedValues: principleYouArchetypeValues,
      required: true,
      example: ["adventurer", "inventor", "strategist"],
    },

    principleYouArchetypeLeast: {
      type: "array",
      description: `Extract the EXACT 2 "Least like" Principle You archetypes explicitly stated in the PDF.
Rules:
- DO NOT infer from challenges, growth opportunities, or any descriptive text.
- ONLY use the report’s explicit "least like" section, typically introduced by a heading like:
  "Here are the archetypes you are least like"
  followed by two archetype names (e.g. "The Critic", "The Enforcer").
- Return exactly 2 items, mapped to the closest matching allowedValues.
- If you cannot find explicit "least like" statements, return an empty array (do not guess).`,
      allowedValues: principleYouArchetypeValues,
      required: true,
      example: ["protector", "peacekeeper"],
    },
  },
};
