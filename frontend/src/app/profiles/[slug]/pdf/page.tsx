import { getProfileBySlug } from "@/lib/utils/sanityApi/profileRequests";
import Image from "next/image";
import INTMLogo from "@/../public/IN-TM-Logo.png";

import PDFBanner from "@/components/profilePDFComponents/PDFBanner";
import PDFKolbeStrengthsCard from "@/components/profilePDFComponents/PDFKolbeStrengthsCard";
import PDFPrinciplesYouCard from "@/components/profilePDFComponents/PDFPrinciplesYouCard";
import PDFValuesCard from "@/components/profilePDFComponents/PDFValuesCard";
import PDFWorkingGeniusCard from "@/components/profilePDFComponents/PDFWorkingGeniusCard";

type tParams = Promise<{ slug: string }>;

export default async function ProfilePDF({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    year: "numeric",
  });
  // const A4DimensionsInPx = {
  //   h: "762px",
  //   w: "1123px",
  // };

  return (
    <div
      className={`h-fit max-h-[762px] min-h-[762px] max-w-[1123px] w-[1123px] bg-mainbackground mt-4 mr-4 ml-4 flex gap-4 overflow-hidden relative`}
    >
      <div className="flex gap-4 w-2/3 h-full flex-col">
        <PDFBanner
          className={"w-full min-h-32 bg-secondary rounded-xl flex p-6"}
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
        <PDFWorkingGeniusCard
          className="w-full h-fit border border-light3 bg-background rounded-xl flex p-6"
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
        <PDFPrinciplesYouCard
          className="w-full h-fit border border-light3 bg-background rounded-xl p-6"
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
      </div>
      <div className="flex flex-col gap-4 h-full w-auto">
        <PDFValuesCard
          className="max-w-96 w-full min-h-32 border border-light3 bg-background rounded-xl pl-6 pt-4 pb-2"
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />

        <PDFKolbeStrengthsCard
          className="max-w-96 w-full h-fit border border-light3 bg-background rounded-xl p-6 "
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-44 h-8 bg-mainbackground blur-sm z-10"></div>

      <div className="absolute bottom-0 left-4 z-10 flex items-center gap-4 opacity-60">
        <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />{" "}
        <span className="text-base text-accent-foreground font-bold">
          {currentDate}
        </span>
      </div>
    </div>
  );
}
