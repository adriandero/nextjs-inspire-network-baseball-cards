import { useState } from "react";

export function usePDFDownload() {
  const [loading, setLoading] = useState(false);

  const downloadPDF = async (url: string, filename: string) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `PDF download failed (HTTP ${response.status})`);
      }
      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(blobUrl);
      link.remove();
    } finally {
      setLoading(false);
    }
  };

  const downloadAllPDFs = (selection: string, showJobRole: boolean, showPrimaryOnly: boolean) =>
    downloadPDF(`/api/deckbuilder/all/pdf?${new URLSearchParams({
      selection, showJobRole: String(showJobRole), showPrimaryOnly: String(showPrimaryOnly),
    })}`, "Compare - All Types - TUG Cards.pdf");

  return { downloadPDF, downloadAllPDFs, loading };
}
