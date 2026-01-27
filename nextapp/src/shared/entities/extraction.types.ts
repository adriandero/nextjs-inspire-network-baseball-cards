// lib/types/extraction.types.ts
export type ExtractionSchema = {
  [fieldName: string]: FieldDefinition;
};

export type FieldDefinition = {
  type: "array" | "string" | "number" | "boolean";
  description: string;
  allowedValues?: string[];
  required?: boolean;
  example?: string[] | string | number | boolean;
};

export type PdfField = {
  fieldName: string;
  asset: {
    _ref: string;
    _type: string;
  };
};

// Fixed: media_type is now a literal type
export type PdfData = {
  filename: string;
  base64: string;
  mediaType: "application/pdf"; // Changed from string to literal
};

export type ClaudeExtractionResponse = {
  confidence?: Record<string, "high" | "medium" | "low" | "none">;
  notes?: string;
  [key: string]:
    | string[]
    | string
    | number
    | boolean
    | null
    | Record<string, string>
    | undefined;
};

export type ExtractedFieldValue = string[] | string | number | boolean;

export type ValidatedExtraction = Record<string, ExtractedFieldValue> & {
  _aiMetadata: {
    confidence: Record<string, string>;
    notes: string;
    extractedAt: string;
  };
};

export type SanityDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

export type SanityFileAsset = {
  _type: "file";
  asset: {
    _ref: string;
    _type: "reference";
  };
};
