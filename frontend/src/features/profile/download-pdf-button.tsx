"use client";

import { GoDownload } from "react-icons/go";
import { Button } from "@/src/components/shadcn-ui/button";
import { useState } from "react";
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
        res.blob(),
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
      className="mt-6 h-fit rounded-xl text-base p-3"
      onClick={handlePDFDownloadCall}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" /> Please wait
        </>
      ) : (
        <>
          <GoDownload size={30} strokeWidth="0.5" className="!w-5 !h-5" />{" "}
          <span>Download TUG Card</span>
        </>
      )}
    </Button>
  );
}
