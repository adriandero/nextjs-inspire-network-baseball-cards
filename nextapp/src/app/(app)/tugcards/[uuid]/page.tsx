import BackNavBar from "@/src/components/layout/back-nav-bar";
import Banner from "@/src/features/profile/banner";
import ValuesCard from "@/src/features/profile/values-card";
import MoreProfilesCard from "@/src/features/profile/more-profiles-card";
import WorkingGeniusCard from "@/src/features/profile/working-genius-card";
import PrinciplesYouCard from "@/src/features/profile/principles-you-card";
import KolbeStrengthsCard from "@/src/features/profile/kolbe-strengths-card";
import MobileNavBanner from "@/src/features/profile/mobile-nav-banner";
import DownloadButton from "@/src/features/profile/download-pdf-button";
import { redirect } from "next/navigation";
import {
  getAuthorizedUser,
  canAccessProfile,
} from "@/src/lib/auth/permissions";
import { getProfileByUuid } from "@/src/lib/data/queries/profiles";
import Link from "next/link";
import { Button } from "@/src/components/shadcn-ui/button";
import { GoEye } from "react-icons/go";

import React from "react";
import { getAuthorizedTeammateProfiles } from "@/src/lib/data/services/profiles";

type tParams = Promise<{ uuid: string }>;

export default async function TugPage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { uuid } = await params;

  const userProfileData = await getAuthorizedUser();
  if (!userProfileData) {
    redirect("/auth/login");
  }

  const profile = await getProfileByUuid(uuid);
  if (!profile) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900">
            Profile Not Found
          </h1>
          <p className="text-gray-600">
            The requested profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  const hasAccess = await canAccessProfile(userProfileData, profile);
  if (!hasAccess) {
    return (
      <div className=" flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-2">
            You don&apos;t have permission to view this profile.
          </p>
          <p className="text-gray-600">
            You can only view profiles from your teams.
          </p>
        </div>
      </div>
    );
  }

  const moreProfiles = await getAuthorizedTeammateProfiles(
    uuid,
    userProfileData
  );

  return (
    <>
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
        className={"hidden md:flex"}
        userProfileData={userProfileData}
        backwardsNavigationUrl={"/browse/"}
      />
      <Banner
        profile={profile}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col grow shrink-0 basis-1/2">
          <ValuesCard profile={profile} />
          <WorkingGeniusCard profile={profile} />
          <KolbeStrengthsCard profile={profile} />
          <PrinciplesYouCard
            profile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
        </div>
        <div className="w-full md:max-w-80 h-fit max-h-screen flex flex-col items-center md:items-start gap-4">
          <MoreProfilesCard
            moreProfiles={moreProfiles}
            currentProfile={profile}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />

          <div className="flex gap-4">
            <Link href={`/tugcards/${uuid}/preview`}>
              <Button
                variant="outline"
                className="hover:border-primary rounded-lg border bg-light1"
              >
                <GoEye size={30} /> Preview
              </Button>
            </Link>

            <DownloadButton
              uuid={uuid}
              fileName={`${profile.name} - ${profile.team?.[0].name} - TUG Card`}
            />
          </div>
        </div>
      </div>
      <footer className="flex item-center p-8"></footer>
    </>
  );
}
