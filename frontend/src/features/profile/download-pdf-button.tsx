"use client";

import { GoDownload } from "react-icons/go";
import { Button } from "@/src/components/shadcn-ui/button";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DownloadButton({
  uuid,
  fileName,
}: {
  uuid: string;
  fileName?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handlePDFDownloadCall = async () => {
    try {
      setLoading(true);

      const pdfBlob = await fetch(`/api/tugcards/${uuid}/pdf`).then((res) =>
        res.blob()
      );

      const blobUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName ? fileName : uuid}.pdf`;

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="hover:border-primary rounded-lg border bg-light1"
      onClick={handlePDFDownloadCall}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" /> Please wait
        </>
      ) : (
        <>
          <GoDownload size={24} strokeWidth={0.5} /> <span>Download</span>
        </>
      )}
    </Button>
  );
}
