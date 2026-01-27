import { AssessmentPdfFile } from "@/src/shared/entities/profile.types";

export function useAssessmentActions(
  assessment: AssessmentPdfFile | null | undefined
) {
  const handleDownload = async () => {
    if (!assessment?.asset?.url) return;

    try {
      const response = await fetch(assessment.asset.url);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = assessment.asset.originalFilename || "assessment.pdf";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // TODO: Add toast notification
    }
  };

  const handlePreview = () => {
    if (!assessment?.asset?.url) return;
    window.open(assessment.asset.url, "_blank", "noopener,noreferrer");
  };

  return { handleDownload, handlePreview };
}
