import { getProfileByUuid } from "@/lib/utils/sanityApi/profileRequests";
import Image from "next/image";
import INTMLogo from "@/../public/IN-TM-Logo.png";

import PDFBanner from "@/components/profilePDFComponents/PDFBanner";
import PDFKolbeStrengthsCard from "@/components/profilePDFComponents/PDFKolbeStrengthsCard";
import PDFPrinciplesYouCard from "@/components/profilePDFComponents/PDFPrinciplesYouCard";
import PDFValuesCard from "@/components/profilePDFComponents/PDFValuesCard";
import PDFWorkingGeniusCard from "@/components/profilePDFComponents/PDFWorkingGeniusCard";

type tParams = Promise<{ uuid: string }>;

export default async function TugCardPDF({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { uuid } = await params;
  const profile = await getProfileByUuid(uuid);

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
          className={
            "w-full min-h-24 max-h-24 bg-secondary rounded-xl flex py-2 px-4"
          }
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
      <div className="flex flex-col gap-4 h-full w-1/3">
        <PDFValuesCard
          className="w-full min-h-[96] border border-light3 bg-background rounded-xl pl-4 py-3"
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />

        <PDFKolbeStrengthsCard
          className="w-full h-fit border border-light3 bg-background rounded-xl p-6 "
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-44 h-8 bg-mainbackground blur-sm z-10"></div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-4">
        {/* Logo container with TM superscript */}
        <div className="relative">
          <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />
          {/* <span className="absolute bottom-[-3px] left-[30px] transform text-[6px] font-bold">
            TM
          </span> */}
        </div>
        <span className="text-base text-accent-foreground font-bold">
          {currentDate}
        </span>
      </div>
    </div>
  );
}
