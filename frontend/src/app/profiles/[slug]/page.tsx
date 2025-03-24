import {
  getProfileBySlug,
  getProfilesByTeamsWithoutSpecifiedProfile,
} from "@/lib/utils/sanityApi/profileRequests";

import ProfileNavBar from "@/components/ProfileNavBar";
import Banner from "@/components/profilePageComponents/Banner";
import ValuesCard from "@/components/profilePageComponents/ValuesCard";
import MoreProfilesCard from "@/components/profilePageComponents/MoreProfilesCard";
import WorkingGeniusCard from "@/components/profilePageComponents/WorkingGeniusCard";
import PrinciplesYouCard from "@/components/profilePageComponents/PrinciplesYouCard";
import KolbeStrengthsCard from "@/components/profilePageComponents/KolbeStrengthsCard";
import MobileNavBanner from "@/components/profilePageComponents/MobileNavBanner";

import DownloadButton from "@/components/profilePageComponents/DownloadPDFButton";
import { SanityDocument } from "next-sanity";
import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
import { redirect } from "next/navigation";

type tParams = Promise<{ slug: string }>;

export default async function ProfilePage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);

  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }
  const userData = await getUserData(session?.user);

  const moreProfiles: SanityDocument[] =
    await getProfilesByTeamsWithoutSpecifiedProfile(profile._id);

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
          <DownloadButton slug={slug} />
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
