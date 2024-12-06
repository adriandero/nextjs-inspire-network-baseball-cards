import {
  getProfileBySlug,
  getProfilesByTeamWithoutSpecifiedProfile,
} from "@/sanityApi/profileRequests";

import NavBar from "@/components/NavBar";
import Banner from "@/components/profilePageComponents/Banner";
import ValuesCard from "@/components/profilePageComponents/ValuesCard";
import MoreProfilesCard from "@/components/profilePageComponents/MoreProfilesCard";
import WorkingGeniusCard from "@/components/profilePageComponents/WorkingGeniusCard";
import PrinciplesYouCard from "@/components/profilePageComponents/PrinciplesYouCard";
import KolbeStrengthsCard from "@/components/profilePageComponents/KolbeStrengthsCard";
import MobileNavBanner from "@/components/profilePageComponents/MobileNavBanner";

import { GoDownload } from "react-icons/go";

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
        <div className="w-full max-w-80">
          <MoreProfilesCard
            moreProfiles={moreProfiles}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />

          <a
            className="max-w-2xl w-fit h-fit border border-light3 justify-center bg-background sm:rounded-2xl p-4 px-6 mt-6 flex flex-row gap-3 bg-white z-10 transition-colors duration-150 hover:bg-tertiary hover:text-white hover:border-mainbackground"
            href={`http://localhost:3000/api/profiles/${slug}/pdf`}
            download={`${slug}.pdf`}
          >
            <GoDownload size={24} /> <span>Download Profile</span>
          </a>
        </div>
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
