// lib/claude/prompt-builder.ts
import {
  ExtractionSchema,
  FieldDefinition,
} from "@/src/shared/entities/extraction.types";

export function buildExtractionPrompt(schema: ExtractionSchema): string {
  const fieldDescriptions = Object.entries(schema)
    .map(([fieldName, definition]: [string, FieldDefinition]) => {
      let desc = `\n### ${fieldName}\n`;
      desc += `- Type: ${definition.type}\n`;
      desc += `- Description: ${definition.description}\n`;

      if (definition.allowedValues) {
        desc += `- Allowed values: ${definition.allowedValues.join(", ")}\n`;
        desc += `- CRITICAL: Only use values from this exact list. Do not invent new values.\n`;
      }

      if (definition.required) {
        desc += `- Required: Yes (must be populated if data exists)\n`;
      }

      if (definition.example) {
        desc += `- Example: ${JSON.stringify(definition.example)}\n`;
      }

      return desc;
    })
    .join("\n");

  return `You are a data extraction assistant. Your job is to extract structured data from PDF documents and return it in JSON format.

// ## Instructions:
// 1. Read through ALL provided PDF documents carefully
// 2. Extract data for the fields defined below
// 3. Only extract data you are CONFIDENT about from the documents
// 4. If you cannot find reliable data for a field, set it to null
// 5. For array fields with allowed values, ONLY use values from the provided list
// 6. Return ONLY valid JSON, no additional text or explanation

// ## Fields to Extract:
// ${fieldDescriptions}

// ## Output Format:
// Return a JSON object with these exact field names. Example structure:
// \`\`\`json
// {
//   "principleYouArchetype": ["adventurer", "innovator"],
//   "principleYouArchetypeLeast": null,
//   "confidence": {
//     "principleYouArchetype": "high",
//     "principleYouArchetypeLeast": "none"
//   },
//   "notes": "Found clear archetype indicators in assessment section. No data found for least-like archetypes."
// }
// \`\`\`

// IMPORTANT: 
// - Include a "confidence" object indicating "high", "medium", "low", or "none" for each field
// - Include a "notes" field explaining what you found or didn't find
// - Return null for any field where you're not confident or found no data
// `;
}
