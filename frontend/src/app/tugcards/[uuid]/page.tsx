import BackNavBar from "@/src/components/layout/back-nav-bar";
import Banner from "@/src/features/profile/banner";
import ValuesCard from "@/src/features/profile/values-card";
import MoreProfilesCard from "@/src/features/profile/more-profiles-card";
import WorkingGeniusCard from "@/src/features/profile/working-genius-card";
import PrinciplesYouCard from "@/src/features/profile/principles-you-card";
import KolbeStrengthsCard from "@/src/features/profile/kolbe-strengths-card";
import MobileNavBanner from "@/src/features/profile/mobile-nav-banner";

import DownloadButton from "@/src/features/profile/download-pdf-button";
import { SanityDocument } from "next-sanity";
import { auth0 } from "@/src/lib/auth0";
import { redirect } from "next/navigation";
import { getUserSanity } from "@/src/lib/data/users";
import { getProfileByUuid, getTeammateProfiles } from "@/src/lib/data/profiles";

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
  const userProfileData = await getUserSanity(session?.user);

  const moreProfiles: SanityDocument[] =
    await getTeammateProfiles(uuid);

  if (!userProfileData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900">
            User Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            Your account is not found in our system.
          </p>
          <p className="text-gray-600">
            Please contact the administrator for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen max-w-screen-lg ">
      <MobileNavBanner
        profile={profile}
        userProfileData={userProfileData.profile}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <BackNavBar
        userProfileData={userProfileData.profile}
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
        </div>
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
