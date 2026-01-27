// lib/sanity/ai/field-mapper.ts

import { ExtractedFieldValue } from "@/src/shared/entities/extraction.types";

type SanityFieldValue = ExtractedFieldValue | Record<string, unknown> | null;

/**
 * Transforms flat extracted data into Sanity's nested structure
 */
export function mapExtractedFieldsToSanity(
  flatData: Record<string, ExtractedFieldValue>,
  pdfFieldName: string
): Record<string, SanityFieldValue> {
  const mapped: Record<string, SanityFieldValue> = {};

  // ========== WORKING GENIUS TRANSFORMATION ==========
  if (pdfFieldName === "workingGeniusAssessmentPdf") {
    const hasWidgetData =
      flatData.workingGeniusWonder ||
      flatData.workingGeniusInvention ||
      flatData.workingGeniusDiscernment ||
      flatData.workingGeniusGalvanizing ||
      flatData.workingGeniusEnablement ||
      flatData.workingGeniusTenacity;

    if (hasWidgetData || flatData.workingGeniusTitle) {
      mapped.workingGenius = {
        ...(flatData.workingGeniusTitle && {
          title: flatData.workingGeniusTitle,
        }),
        ...(hasWidgetData && {
          widget: {
            wonder: flatData.workingGeniusWonder || null,
            invention: flatData.workingGeniusInvention || null,
            discernment: flatData.workingGeniusDiscernment || null,
            galvanizing: flatData.workingGeniusGalvanizing || null,
            enablement: flatData.workingGeniusEnablement || null,
            tenacity: flatData.workingGeniusTenacity || null,
          },
        }),
      };
    }
  }

  // ========== KOLBE TRANSFORMATION ==========
  else if (pdfFieldName === "kolbeAssessmentPdf") {
    const hasKolbeData =
      flatData.kolbeFactFinder ||
      flatData.kolbeFollowThru ||
      flatData.kolbeQuickStart ||
      flatData.kolbeImplementer;

    if (hasKolbeData) {
      mapped.kolbeStrengths2 = {
        factFinder: flatData.kolbeFactFinder || null,
        followThru: flatData.kolbeFollowThru || null,
        quickStart: flatData.kolbeQuickStart || null,
        implementer: flatData.kolbeImplementer || null,
      };
    }
  }

  // ========== DIRECT MAPPINGS (no transformation needed) ==========
  else if (pdfFieldName === "principlesYouAssessmentPdf") {
    if (flatData.principleYouArchetype) {
      mapped.principleYouArchetype = flatData.principleYouArchetype;
    }
    if (flatData.principleYouArchetypeLeast) {
      mapped.principleYouArchetypeLeast = flatData.principleYouArchetypeLeast;
    }
  } else if (pdfFieldName === "valuesAssessmentPdf") {
    if (flatData.values) {
      mapped.values = flatData.values;
    }
  }

  return mapped;
}
