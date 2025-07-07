import { useState } from "react";

export function usePDFDownload() {
  const [loading, setLoading] = useState(false);

  const downloadPDF = async (url: string, filename: string) => {
    setLoading(true);
    try {
      // Warm-up request
      await fetch(url + `&warm=true`).catch(() => {});
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pdfBlob = await fetch(url).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      });

      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { downloadPDF, loading };
}
