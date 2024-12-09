"use client";

import { saveAs } from "file-saver";
import { GoDownload } from "react-icons/go";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function DownloadButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);

  const handlePDFDownloadCall = async () => {
    setLoading(true);

    try {
      const pdfBlob = await fetch(
        process.env.BASE_URL + `/api/profiles/${slug}/pdf`
      ).then((res) => res.blob());
      saveAs(pdfBlob, `${slug}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download the PDF. Please try again later.");
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
          <span>Download Profile</span>
        </>
      )}
    </Button>
  );
}
