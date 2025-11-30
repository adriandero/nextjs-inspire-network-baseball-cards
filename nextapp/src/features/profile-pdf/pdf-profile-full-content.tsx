import Image from "next/image";
import INTMLogo from "@/public/images/in-tug-card-logo.png";
import PdfBanner from "@/src/features/profile-pdf/pdf-banner";
import PdfKolbeStrengthsCard from "@/src/features/profile-pdf/pdf-kolbe-strengths-card";
import PdfPrinciplesYouCard from "@/src/features/profile-pdf/pdf-principles-you-card";
import PdfValuesCard from "@/src/features/profile-pdf/pdf-values-card";
import { Profile } from "@/src/shared/entities/profile";
import PdfWorkingGeniusCard from "@/src/features/profile-pdf/pdf-working-genius-card";
import { cn } from "@/src/lib/utils";
import React from "react";

interface PDFProfileFullContentProps {
  profile?: Profile;
  className?: string;
}

export function PDFProfileFullContent({
  profile,
  className,
}: PDFProfileFullContentProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "h-fit max-h-[762px] min-h-[762px] max-w-[1123px] w-[1123px]",
        "bg-mainbackground mt-4 mr-4 ml-4 flex gap-4 overflow-hidden relative",
        className
      )}
    >
      <div className="flex gap-4 w-2/3 h-full flex-col">
        <PdfBanner
          className="w-full min-h-24 max-h-24 bg-secondary rounded-xl flex py-2 px-4"
          profile={profile}
          _id=""
          _rev=""
          _type=""
          _createdAt=""
          _updatedAt=""
        />
        <PdfWorkingGeniusCard
          className="w-full h-fit border border-light3 bg-background rounded-xl flex p-6"
          profile={profile}
          _id=""
          _rev=""
          _type=""
          _createdAt=""
          _updatedAt=""
        />
        <PdfPrinciplesYouCard
          className="w-full h-fit border border-light3 bg-background rounded-xl p-6"
          profile={profile}
          _id=""
          _rev=""
          _type=""
          _createdAt=""
          _updatedAt=""
        />
      </div>

      <div className="flex flex-col gap-4 h-full w-1/3">
        <PdfValuesCard
          className="w-full min-h-[96] border border-light3 bg-background rounded-xl pl-4 py-3"
          profile={profile}
          _id=""
          _rev=""
          _type=""
          _createdAt=""
          _updatedAt=""
        />
        <PdfKolbeStrengthsCard
          className="w-full h-fit border border-light3 bg-background rounded-xl p-6"
          profile={profile}
          _id=""
          _rev=""
          _type=""
          _createdAt=""
          _updatedAt=""
        />
      </div>

      <div className="absolute bottom-0 right-0 w-44 h-8 bg-mainbackground blur-sm z-10" />

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-4">
        <span className="text-base text-accent-foreground font-bold">
          {currentDate}
        </span>
        <div className="relative">
          <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />
        </div>
      </div>
    </div>
  );
}
