import { getProfileBySlug } from "@/lib/utils/sanityApi/profileRequests";
import PDFBanner from "@/components/profilePDFComponents/PDFBanner";
import PDFKolbeStrengthsCard from "@/components/profilePDFComponents/PDFKolbeStrengthsCard";
import PDFPrinciplesYouCard from "@/components/profilePDFComponents/PDFPrinciplesYouCard";
import PDFValuesCard from "@/components/profilePDFComponents/PDFValuesCard";
import PDFWorkingGeniusCard from "@/components/profilePDFComponents/PDFWorkingGeniusCard";
import { checkIfSession } from "@/lib/utils/sessionCheck";


type tParams = Promise<{ slug: string }>;

export default async function ProfilePDF({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  await checkIfSession();

  const { slug } = await params;
  const profile = await getProfileBySlug(slug);


  // const A4DimensionsInPx = {
  //   h: "762px",
  //   w: "1123px",
  // };

  return (
    <div
      className={`h-[762px] w-[1123px] bg-mainbackground m-4 flex gap-4 flex-col`}
    >
      <div className="flex gap-4 w-full h-fit">
        <PDFBanner
          className={"w-full h-32 bg-secondary rounded-xl flex p-6"}
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
        <PDFValuesCard
          className="max-w-96 w-full h-32 border border-light3 bg-background rounded-xl flex p-6"
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
      </div>
      <div className="flex gap-4 w-full h-full">
        <div className="flex flex-col gap-4 h-full w-full">
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
    </div>
  );
}
