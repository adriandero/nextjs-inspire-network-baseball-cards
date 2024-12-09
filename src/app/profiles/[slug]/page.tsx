import {
  getProfileBySlug,
  getProfilesByTeamWithoutSpecifiedProfile,
} from "@/lib/utils/sanityApi/profileRequests";

import NavBar from "@/components/NavBar";
import Banner from "@/components/profilePageComponents/Banner";
import ValuesCard from "@/components/profilePageComponents/ValuesCard";
import MoreProfilesCard from "@/components/profilePageComponents/MoreProfilesCard";
import WorkingGeniusCard from "@/components/profilePageComponents/WorkingGeniusCard";
import PrinciplesYouCard from "@/components/profilePageComponents/PrinciplesYouCard";
import KolbeStrengthsCard from "@/components/profilePageComponents/KolbeStrengthsCard";
import MobileNavBanner from "@/components/profilePageComponents/MobileNavBanner";


import { checkIfSession } from "@/lib/utils/sessionCheck";

import DownloadButton from "@/components/profilePageComponents/DownloadPDFButton";

type tParams = Promise<{ slug: string }>;

export default async function ProfilePage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  await checkIfSession();

  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  const moreProfiles = await getProfilesByTeamWithoutSpecifiedProfile(
    profile._id,
    profile.team?.slug.current
  );

  //TODO propper sanitydocument typing

  return (
    <div className="w-full h-screen max-w-screen-lg ">
      <MobileNavBanner
        profile={profile}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <NavBar />
      <Banner
        profile={profile}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <main className="flex flex-wrap mt-4 gap-8">
        <div className="flex flex-col grow shrink-0 basis-1/2">
          <ValuesCard
            profile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
          <WorkingGeniusCard
            profile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
          <PrinciplesYouCard
            profile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
          <KolbeStrengthsCard
            profile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
        </div>
        <div className="w-full md:max-w-80 flex flex-col items-center md:items-start">
          <MoreProfilesCard
            moreProfiles={moreProfiles}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />

          <DownloadButton slug={slug} />
        </div>
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
