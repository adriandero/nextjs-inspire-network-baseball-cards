import {
  getProfileBySlug,
  getProfilesFromUserTeams,
  ProfilesFromUserTeams,
} from "@/lib/utils/sanityApi/profileRequests";

import ProfileNavBar from "@/components/ProfileNavBar";
import Banner from "@/components/profilePageComponents/Banner";
import ValuesCard from "@/components/profilePageComponents/ValuesCard";
import MoreProfilesCard from "@/components/profilePageComponents/MoreProfilesCard";
import WorkingGeniusCard from "@/components/profilePageComponents/WorkingGeniusCard";
import PrinciplesYouCard from "@/components/profilePageComponents/PrinciplesYouCard";
import KolbeStrengthsCard from "@/components/profilePageComponents/KolbeStrengthsCard";
import MobileNavBanner from "@/components/profilePageComponents/MobileNavBanner";

import { checkIfSession, getUserData } from "@/lib/utils/sessionCheck";

import DownloadButton from "@/components/profilePageComponents/DownloadPDFButton";
import { SanityDocument } from "next-sanity";
import { Team } from "@/app/dashboard/page";

type tParams = Promise<{ slug: string }>;

export default async function ProfilePage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  await checkIfSession();

  const userData = await getUserData();

  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  // const moreProfiles = await getProfilesByTeamWithoutSpecifiedProfile(
  //   profile._id,
  //   profile.team?.slug.current
  // );

  const emptyData: SanityDocument[] = [];
  let profilesFromUserTeams: ProfilesFromUserTeams = { teamProfiles: [] };

  if (userData?.team) {
    profilesFromUserTeams = await getProfilesFromUserTeams(
      userData.email,
      userData.team.map((team: Team) => team.name)
    );
  }

  const data = userData?.team ? profilesFromUserTeams.teamProfiles : emptyData;
  console.log(userData);

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
      <ProfileNavBar
        userDataProfile={userData.profile}
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
            moreProfiles={data}
            currentProfile={profile}
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
