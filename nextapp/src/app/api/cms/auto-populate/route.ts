// app/api/sanity/auto-populate/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DOCUMENT_EXTRACTION_SCHEMAS } from "@/src/lib/sanity/ai/extraction-schema";
import { buildExtractionPrompt } from "@/src/lib/sanity/ai/prompt-builder";
import {
  SanityDocument,
  PdfField,
  PdfData,
  ClaudeExtractionResponse,
  ValidatedExtraction,
  ExtractionSchema,
  SanityFileAsset,
  ExtractedFieldValue,
} from "@/src/shared/entities/extraction.types";
import { ContentBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { writeClient } from "@/src/lib/sanity/client";
import { mapExtractedFieldsToSanity } from "@/src/lib/sanity/ai/field-mapper";
import { APIError } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// CORS headers helper
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Or specify: 'http://localhost:3333'
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Handle OPTIONS preflight request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      documentId: string;
      documentType: string;
      pdfField?: string; // ← NEW: optional specific PDF field
    };
    let { documentId, documentType, pdfField } = body;

    console.log("🚀 Auto-populate called for:", {
      documentId,
      documentType,
      pdfField: pdfField || "ALL",
    });

    // Try to fetch the document - first as published, then as draft
    let document: SanityDocument | undefined = undefined;

    try {
      const fetchedDoc =
        await writeClient.getDocument<SanityDocument>(documentId);
      console.log(
        "📄 Fetched document:",
        fetchedDoc ? "exists" : "undefined",
        fetchedDoc?._id,
      );

      if (fetchedDoc && fetchedDoc._id) {
        document = fetchedDoc;
        console.log("✅ Document fetched (published):", document._id);
      }
    } catch (error) {
      console.log("⚠️ Error fetching published document:", error);
    }

    // If not found, try draft version
    if (!document) {
      console.log("⚠️ Document not found as published, trying draft...");
      const draftId = `drafts.${documentId}`;

      try {
        const fetchedDoc =
          await writeClient.getDocument<SanityDocument>(draftId);
        console.log(
          "📄 Fetched draft document:",
          fetchedDoc ? "exists" : "undefined",
          fetchedDoc?._id,
        );

        if (fetchedDoc && fetchedDoc._id) {
          document = fetchedDoc;
          documentId = draftId; // Update for patching later
          console.log("✅ Document fetched (draft):", document._id);
        }
      } catch (draftError) {
        console.log("⚠️ Error fetching draft document:", draftError);
      }
    }

    if (!document || !document._id) {
      console.error("❌ Document not found with ID:", documentId);
      console.error("Sanity client config:", {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        hasToken: !!process.env.SANITY_API_TOKEN,
      });

      return NextResponse.json(
        {
          success: false,
          error: `Document not found with ID: ${documentId}. Make sure the document exists, is saved, and your Sanity token has read permissions.`,
        },
        {
          status: 404,
          headers: corsHeaders(),
        },
      );
    }

    console.log(
      "🔍 PDF fields in document:",
      JSON.stringify(
        Object.entries(document)
          .filter(([key]) => key.endsWith("Pdf"))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        null,
        2,
      ),
    );

    // Extract all PDF fields from document
    const allPdfFields = extractPdfFields(document);

    // Filter to specific PDF if requested
    const pdfFields = pdfField
      ? allPdfFields.filter((f) => f.fieldName === pdfField)
      : allPdfFields;

    if (pdfFields.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: pdfField
            ? `PDF field '${pdfField}' not found or has no uploaded file. Available PDFs: ${allPdfFields.map((f) => f.fieldName).join(", ")}`
            : 'No PDFs found in document. Make sure you uploaded a PDF to a field ending with "Pdf".',
        },
        {
          status: 400,
          headers: corsHeaders(),
        },
      );
    }

    console.log(
      "📎 Processing PDFs:",
      pdfFields.map((f) => f.fieldName),
    );

    // Process each PDF separately for better error handling and field mapping
    const allExtractedData: Record<string, unknown> = {};
    const allMetadata: Array<{
      field: string;
      confidence: Record<string, string>;
      notes: string;
    }> = [];

    for (const pdfFieldItem of pdfFields) {
      try {
        console.log(`\n🔄 Processing: ${pdfFieldItem.fieldName}`);

        // Fetch the PDF
        const pdfContent = await fetchPdfAsBase64(pdfFieldItem.asset._ref);
        console.log(`📥 PDF downloaded: ${pdfFieldItem.fieldName}`);

        // Build schema key: "documentType:pdfFieldName"
        const schemaKey = `${documentType}:${pdfFieldItem.fieldName}`;
        console.log(`🔍 Looking up schema: ${schemaKey}`);

        // Extract data with Claude
        const extractedData = await extractDataWithClaude(
          [pdfContent],
          schemaKey,
        );

        console.log(
          `🤖 Claude extracted fields:`,
          Object.keys(extractedData).filter((k) => k !== "_aiMetadata"),
        );

        // Transform flat extracted data to Sanity's nested structure
        const mappedData = mapExtractedFieldsToSanity(
          extractedData,
          pdfFieldItem.fieldName,
        );

        console.log(`🗺️  Mapped to Sanity fields:`, Object.keys(mappedData));

        // Merge into accumulated results
        Object.assign(allExtractedData, mappedData);

        // Store metadata
        if (extractedData._aiMetadata) {
          allMetadata.push({
            field: pdfFieldItem.fieldName,
            confidence: extractedData._aiMetadata.confidence,
            notes: extractedData._aiMetadata.notes,
          });
        }

        console.log(`✅ ${pdfFieldItem.fieldName} processed successfully`);
      } catch (error) {
        console.error(`❌ Error processing ${pdfFieldItem.fieldName}:`, error);

        // Store error in metadata but continue with other PDFs
        allMetadata.push({
          field: pdfFieldItem.fieldName,
          confidence: {},
          notes: `Extraction failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    }

    // Update document with all extracted data
    if (Object.keys(allExtractedData).length > 0) {
      console.log(
        "\n💾 Updating Sanity document with:",
        Object.keys(allExtractedData),
      );

      await writeClient.patch(documentId).set(allExtractedData).commit();

      console.log("✅ Document updated successfully");

      // Verify what was written
      const verifyDoc = await writeClient.fetch(
        `*[_id == "${documentId}"][0]{
          _id, 
          principleYouArchetype, 
          principleYouArchetypeLeast,
          workingGenius,
          kolbeStrengths2,
          values
        }`,
      );
      console.log("🔍 Verification - Document after update:", verifyDoc);
    } else {
      console.warn("⚠️ No data extracted from any PDFs");
    }

    return NextResponse.json(
      {
        success: true,
        populatedFields: Object.keys(allExtractedData),
        message: "Review the populated fields and publish when ready",
        metadata: allMetadata,
      },
      {
        headers: corsHeaders(),
      },
    );
  } catch (error) {
    console.error("❌ Auto-populate error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Stack trace:", errorStack);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      {
        status: 500,
        headers: corsHeaders(),
      },
    );
  }
}

// Helper: Extract PDF field references from document
function extractPdfFields(document: SanityDocument): PdfField[] {
  const pdfFields: PdfField[] = [];

  Object.entries(document).forEach(([key, value]) => {
    // Type guard to check if value is a Sanity file asset
    if (
      key.endsWith("Pdf") &&
      value !== null &&
      typeof value === "object" &&
      "asset" in value &&
      typeof value.asset === "object" &&
      value.asset !== null &&
      "_ref" in value.asset
    ) {
      const fileAsset = value as SanityFileAsset;
      pdfFields.push({
        fieldName: key,
        asset: fileAsset.asset,
      });
    }
  });

  return pdfFields;
}

// Helper: Fetch PDF from Sanity CDN as base64
// app/api/sanity/auto-populate/route.ts

// Update the fetchPdfAsBase64 function with better logging and error handling
async function fetchPdfAsBase64(assetRef: string): Promise<PdfData> {
  console.log("📦 Fetching PDF with asset ref:", assetRef);

  // Sanity file references are in format: file-{assetId}-{extension}
  // We need to extract the assetId
  const match = assetRef.match(/file-(.+)-pdf/);

  if (!match) {
    throw new Error(`Invalid asset reference format: ${assetRef}`);
  }

  const assetId = match[1];
  console.log("🔑 Extracted asset ID:", assetId);

  // Construct Sanity CDN URL
  const url = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${assetId}.pdf`;
  console.log("🌐 Fetching from URL:", url);

  const response = await fetch(url);

  if (!response.ok) {
    // Log more details about the failure
    console.error("❌ Failed to fetch PDF:", {
      status: response.status,
      statusText: response.statusText,
      url,
      assetRef,
    });
    throw new Error(
      `Failed to fetch PDF: ${response.statusText} (${response.status}). Check if the file exists in Sanity.`,
    );
  }

  console.log(
    "✅ PDF fetched successfully, size:",
    response.headers.get("content-length"),
  );

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return {
    filename: `document-${assetId}.pdf`,
    base64,
    mediaType: "application/pdf" as const,
  };
}

async function extractDataWithClaude(
  pdfs: PdfData[],
  documentType: string,
  retries = 3,
): Promise<ValidatedExtraction> {
  try {
    console.log("🔍 Looking for schema for document type:", documentType);
    console.log(
      "📋 Available schemas:",
      Object.keys(DOCUMENT_EXTRACTION_SCHEMAS),
    );

    const schema = DOCUMENT_EXTRACTION_SCHEMAS[documentType];

    if (!schema) {
      throw new Error(
        `No extraction schema defined for document type: ${documentType}`,
      );
    }

    const prompt = buildExtractionPrompt(schema);

    // Use Anthropic's ContentBlockParam type directly
    const content: ContentBlockParam[] = [
      {
        type: "text",
        text: prompt,
      },
    ];

    // Add each PDF to the content array
    pdfs.forEach((pdf) => {
      content.push({
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf", // Literal type
          data: pdf.base64,
        },
      });
    });

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content,
        },
      ],
    });

    // Extract text content from Claude's response
    const textContent = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text",
    );

    if (!textContent) {
      throw new Error("No text response from Claude");
    }

    // Parse JSON from response (handles ```json wrapper)
    const jsonMatch =
      textContent.text.match(/```json\n?([\s\S]*?)\n?```/) ||
      textContent.text.match(/({[\s\S]*})/);

    if (!jsonMatch) {
      throw new Error("Could not extract JSON from Claude response");
    }

    const extractedData = JSON.parse(jsonMatch[1]) as ClaudeExtractionResponse;

    // Validate and clean the extraction
    return validateAndCleanExtraction(extractedData, schema);
  } catch (error) {
    if (error instanceof APIError && error.status === 429 && retries > 0) {
      const waitTime = Math.pow(2, 4 - retries) * 1000; // 2s, 4s, 8s
      console.log(`⏳ Rate limited. Waiting ${waitTime}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return extractDataWithClaude(pdfs, documentType, retries - 1);
    }
    throw error;
  }
}

// Helper: Validate extracted data against schema
function validateAndCleanExtraction(
  data: ClaudeExtractionResponse,
  schema: ExtractionSchema,
): ValidatedExtraction {
  const cleaned: Record<string, ExtractedFieldValue> = {};
  const confidence = data.confidence || {};

  Object.keys(schema).forEach((fieldName) => {
    const value = data[fieldName];
    const definition = schema[fieldName];

    // Skip null/undefined values
    if (value === null || value === undefined) {
      return;
    }

    // Validate arrays against allowed values
    if (definition.allowedValues && Array.isArray(value)) {
      const validValues = value.filter(
        (v) => typeof v === "string" && definition.allowedValues!.includes(v),
      );

      if (validValues.length > 0) {
        cleaned[fieldName] = validValues;
      }
    }
    // Validate primitives match expected type
    else if (typeof value === definition.type) {
      cleaned[fieldName] = value as ExtractedFieldValue;
    }
  });

  // Fixed: Proper typing with intersection
  return {
    ...cleaned,
    _aiMetadata: {
      confidence,
      notes: data.notes || "No additional notes",
      extractedAt: new Date().toISOString(),
    },
  } as ValidatedExtraction;
}
