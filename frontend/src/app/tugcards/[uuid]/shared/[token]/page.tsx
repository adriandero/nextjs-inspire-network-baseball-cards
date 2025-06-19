import { getProfileByUuid } from "@/src/lib/utils/sanityApi/profileRequests";
import PdfBanner from "@/src/features/profile-pdf/pdf-banner";
import PdfKolbeStrengthsCard from "@/src/features/profile-pdf/pdf-kolbe-strengths-card";
import PdfPrinciplesYouCard from "@/src/features/profile-pdf/pdf-principles-you-card";
import PdfValuesCard from "@/src/features/profile-pdf/pdf-values-card";
import PdfWorkingGeniusCard from "@/src/features/profile-pdf/pdf-working-genius-card";

type tParams = Promise<{ uuid: string }>;

export default async function SharedTugCard({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { uuid } = await params;
  const profile = await getProfileByUuid(uuid);

  // const A4DimensionsInPx = {
  //   h: "762px",
  //   w: "1123px",
  // };
  //TODO
  return (
    <div
      className={`h-[762px] w-[1123px] bg-mainbackground m-4 flex gap-4 flex-col`}
    >
      <div className="flex gap-4 w-full h-fit">
        <PdfBanner
          className={"w-full h-32 bg-secondary rounded-xl flex p-6"}
          profile={profile}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
        <PdfValuesCard
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
          <PdfWorkingGeniusCard
            className="w-full h-fit border border-light3 bg-background rounded-xl flex p-6"
            profile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
          <PdfPrinciplesYouCard
            className="w-full h-fit border border-light3 bg-background rounded-xl p-6"
            profile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
        </div>

        <PdfKolbeStrengthsCard
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
