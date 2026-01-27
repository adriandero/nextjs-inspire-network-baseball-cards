// lib/sanity/ai/extraction-schema.ts
import { ExtractionSchema } from "@/src/shared/entities/extraction.types";
import { principleYouArchetypeList } from "./principle-you-archetype.types";
import { workingGeniusList } from "./working-genius.types";

const principleYouArchetypeValues = principleYouArchetypeList.map(
  (item) => item.value
);

const workingGeniusTitleValues = workingGeniusList.map((item) => item.title);

export const DOCUMENT_EXTRACTION_SCHEMAS: Record<string, ExtractionSchema> = {
  // ========== PRINCIPLES YOU ==========
  "profile:principlesYouAssessmentPdf": {
    principleYouArchetype: {
      type: "array",
      description: `Extract the EXACT 3 "Most like" Principle You archetypes explicitly stated in the PDF.
Rules:
- DO NOT infer from descriptions, strengths, talents, or growth needs.
- ONLY use the report's explicit result statements, typically:
  1) "You are most like The <Archetype>" (this is the #1 archetype)
  2) "You also have attributes of the <Archetype> and the <Archetype>" (these are #2 and #3)
- Return exactly 3 items, mapped to the closest matching allowedValues.
- If the report uses title-case names like "The Growth Seeker", map them to camelCase (e.g. "growthSeeker").
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
- ONLY use the report's explicit "least like" section, typically introduced by a heading like:
  "Here are the archetypes you are least like"
  followed by two archetype names (e.g. "The Critic", "The Enforcer").
- Return exactly 2 items, mapped to camelCase (e.g. "quietLeader").
- If you cannot find explicit "least like" statements, return an empty array (do not guess).`,
      allowedValues: principleYouArchetypeValues,
      required: true,
      example: ["protector", "peacekeeper"],
    },
  },

  // ========== WORKING GENIUS ==========
  "profile:workingGeniusAssessmentPdf": {
    workingGeniusTitle: {
      type: "string",
      description: `Extract the Working Genius title/type if explicitly stated in the PDF.
This is typically shown as a title like "The Creative Dreamer" or "The Assertive Driver".
Map to camelCase format (e.g., "theCreativeDreamer").
If not found, return null.`,
      allowedValues: workingGeniusTitleValues,
      required: false,
      example: "theCreativeDreamer",
    },

    workingGeniusWonder: {
      type: "string",
      description: `Determine the level for WONDER (W).
Rules:
- If listed under "WORKING GENIUS" → return "green"
- If listed under "WORKING COMPETENCY" → return "yellow"  
- If listed under "WORKING FRUSTRATION" → return "red"
Wonder is about: pondering possibility of greater potential and opportunity.`,
      allowedValues: ["green", "yellow", "red"],
      required: true,
      example: "yellow",
    },

    workingGeniusInvention: {
      type: "string",
      description: `Determine the level for INVENTION (I).
Rules:
- If listed under "WORKING GENIUS" → return "green"
- If listed under "WORKING COMPETENCY" → return "yellow"
- If listed under "WORKING FRUSTRATION" → return "red"
Invention is about: creating original and novel ideas and solutions.`,
      allowedValues: ["green", "yellow", "red"],
      required: true,
      example: "red",
    },

    workingGeniusDiscernment: {
      type: "string",
      description: `Determine the level for DISCERNMENT (D).
Rules:
- If listed under "WORKING GENIUS" → return "green"
- If listed under "WORKING COMPETENCY" → return "yellow"
- If listed under "WORKING FRUSTRATION" → return "red"
Discernment is about: using intuition and instincts to evaluate ideas or plans.`,
      allowedValues: ["green", "yellow", "red"],
      required: true,
      example: "green",
    },

    workingGeniusGalvanizing: {
      type: "string",
      description: `Determine the level for GALVANIZING (G).
Rules:
- If listed under "WORKING GENIUS" → return "green"
- If listed under "WORKING COMPETENCY" → return "yellow"
- If listed under "WORKING FRUSTRATION" → return "red"
Galvanizing is about: rallying people and inspiring them to take action.`,
      allowedValues: ["green", "yellow", "red"],
      required: true,
      example: "red",
    },

    workingGeniusEnablement: {
      type: "string",
      description: `Determine the level for ENABLEMENT (E).
Rules:
- If listed under "WORKING GENIUS" → return "green"
- If listed under "WORKING COMPETENCY" → return "yellow"
- If listed under "WORKING FRUSTRATION" → return "red"
Enablement is about: providing encouragement and assistance for projects and tasks.`,
      allowedValues: ["green", "yellow", "red"],
      required: true,
      example: "green",
    },

    workingGeniusTenacity: {
      type: "string",
      description: `Determine the level for TENACITY (T).
Rules:
- If listed under "WORKING GENIUS" → return "green"
- If listed under "WORKING COMPETENCY" → return "yellow"
- If listed under "WORKING FRUSTRATION" → return "red"
Tenacity is about: pushing projects through to completion to ensure desired results.`,
      allowedValues: ["green", "yellow", "red"],
      required: true,
      example: "yellow",
    },
  },

  // ========== VALUES ==========
  "profile:valuesAssessmentPdf": {
    values: {
      type: "array",
      description: `Extract the top 5 values explicitly listed in the "Your top values are:" section.
Rules:
- Extract ONLY the value names (e.g., "Loyalty", "Integrity", "Friendship")
- Return them in lowercase
- Maintain the order they appear in the PDF
- Return exactly 5 values if available
- Do NOT infer values from descriptions - only extract explicitly stated top values`,
      allowedValues: undefined, // No fixed list - values can be anything
      required: true,
      example: [
        "loyalty",
        "integrity",
        "friendship",
        "competence",
        "adventure",
      ],
    },
  },

  // ========== KOLBE ==========
  "profile:kolbeAssessmentPdf": {
    kolbeFactFinder: {
      type: "string",
      description: `Extract the FIRST number from the Kolbe MO (Mental Operation) format.
Look for text like "Your MO of 7-4-7-2" or "MO: 7-4-7-2".
The MO format is: FactFinder-FollowThru-QuickStart-Implementer.
Return the first number as a string.
If the PDF indicates "In Transition", return "inTransition".`,
      allowedValues: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "inTransition",
      ],
      required: true,
      example: "7",
    },

    kolbeFollowThru: {
      type: "string",
      description: `Extract the SECOND number from the Kolbe MO (Mental Operation) format.
Look for text like "Your MO of 7-4-7-2" or "MO: 7-4-7-2".
The MO format is: FactFinder-FollowThru-QuickStart-Implementer.
Return the second number as a string.
If the PDF indicates "In Transition", return "inTransition".`,
      allowedValues: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "inTransition",
      ],
      required: true,
      example: "4",
    },

    kolbeQuickStart: {
      type: "string",
      description: `Extract the THIRD number from the Kolbe MO (Mental Operation) format.
Look for text like "Your MO of 7-4-7-2" or "MO: 7-4-7-2".
The MO format is: FactFinder-FollowThru-QuickStart-Implementer.
Return the third number as a string.
If the PDF indicates "In Transition", return "inTransition".`,
      allowedValues: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "inTransition",
      ],
      required: true,
      example: "7",
    },

    kolbeImplementer: {
      type: "string",
      description: `Extract the FOURTH number from the Kolbe MO (Mental Operation) format.
Look for text like "Your MO of 7-4-7-2" or "MO: 7-4-7-2".
The MO format is: FactFinder-FollowThru-QuickStart-Implementer.
Return the fourth number as a string.
If the PDF indicates "In Transition", return "inTransition".`,
      allowedValues: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "inTransition",
      ],
      required: true,
      example: "2",
    },
  },
};
