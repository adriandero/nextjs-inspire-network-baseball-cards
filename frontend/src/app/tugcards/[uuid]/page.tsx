import {
  getProfileByUuid,
  getProfilesByTeamsWithoutSpecifiedProfile,
} from "@/src/lib/utils/sanityApi/profileRequests";

import ProfileNavBar from "@/src/components/layout/ProfileNavBar";
import Banner from "@/src/features/profilePageComponents/Banner";
import ValuesCard from "@/src/features/profilePageComponents/ValuesCard";
import MoreProfilesCard from "@/src/features/profilePageComponents/MoreProfilesCard";
import WorkingGeniusCard from "@/src/features/profilePageComponents/WorkingGeniusCard";
import PrinciplesYouCard from "@/src/features/profilePageComponents/PrinciplesYouCard";
import KolbeStrengthsCard from "@/src/features/profilePageComponents/KolbeStrengthsCard";
import MobileNavBanner from "@/src/features/profilePageComponents/MobileNavBanner";

import DownloadButton from "@/src/features/profilePageComponents/DownloadPDFButton";
import { SanityDocument } from "next-sanity";
import { auth0 } from "@/src/lib/auth0";
import { getUserData } from "@/src/lib/utils/sessionCheck";
import { redirect } from "next/navigation";

type tParams = Promise<{ uuid: string }>;

export default async function TugPage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { uuid } = await params;
  const profile = await getProfileByUuid(uuid);

  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }
  const userData = await getUserData(session?.user);

  const moreProfiles: SanityDocument[] =
    await getProfilesByTeamsWithoutSpecifiedProfile(uuid);

  // async function handleShare() {}

  // let profilesFromUserTeams: ProfilesFromUserTeams = { teamProfiles: [] };

  //TODO propper sanitydocument typing

  // console.log(moreProfiles);
  return (
    <div className="w-full h-screen max-w-screen-lg ">
      <MobileNavBanner
        profile={profile}
        userProfileData={userData.profile}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <ProfileNavBar
        userProfileData={userData.profile}
        backwardsNavigationUrl={"/browse/"}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <Banner
        profile={profile}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <main className="flex flex-wrap gap-8">
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
        <div className="w-full md:max-w-80 h-fit max-h-screen flex flex-col items-center md:items-start">
          <MoreProfilesCard
            moreProfiles={moreProfiles}
            currentProfile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
          <DownloadButton uuid={uuid} />
          {/* {  <Button
            variant="outline"
            className="mt-6 h-fit rounded-xl text-base p-3"
            onClick={handleShare}
          >
            <>
              <GoDownload size={30} strokeWidth="0.5" className="!w-5 !h-5" />{" "}
              <span>Download Profile</span>
            </>
          </Button>{" "}} */}
        </div>
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}