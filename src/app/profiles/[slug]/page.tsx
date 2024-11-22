import {
  getProfileBySlug,
  getProfilesByTeamWithoutSpecifiedProfile,
} from "@/api/profileRequests";

import NavBar from "@/components/NavBar";
import Banner from "@/components/profilePageComponents/Banner";
import ValuesCard from "@/components/profilePageComponents/ValuesCard";
import MoreProfilesCard from "@/components/profilePageComponents/MoreProfilesCard";
import WorkingGeniusCard from "@/components/profilePageComponents/WorkingGeniusCard";
import PrinciplesYouCard from "@/components/profilePageComponents/PrinciplesYouCard";
import KolbeStrengthsCard from "@/components/profilePageComponents/KolbeStrengthsCard";

type tParams = Promise<{ slug: string }>;

export default async function ProfilePage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  const moreProfiles = await getProfilesByTeamWithoutSpecifiedProfile(
    profile._id,
    profile.team?.slug.current
  );

  //TODO propper sanitydocument typing

  return (
    <div className="w-full h-x^screen max-w-screen-lg justify-self-center">
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
        <div className="flex flex-col grow shrink-0 basis-1/2 min-w-96">
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
        <MoreProfilesCard
          moreProfiles={moreProfiles}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
