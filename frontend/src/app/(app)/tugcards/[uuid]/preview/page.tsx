import BackNavBar from "@/src/components/layout/back-nav-bar";
import {
  canAccessProfile,
  getAuthorizedUser,
} from "@/src/lib/auth/permissions";
import { redirect } from "next/navigation";
import { getProfileByUuid } from "@/src/lib/data/profiles";
import { PDFProfileFullContent } from "@/src/features/profile-pdf/pdf-profile-full-content";

type tParams = Promise<{ uuid: string }>;

export default async function PreviewPage({ params }: { params: tParams }) {
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
        <div className="text-center py-8">
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

  return (
    <div className="min-h-screen w-full bg-mainbackground">
      <BackNavBar
        userProfileData={userProfileData}
        backwardsNavigationUrl={`/tugcards/${uuid}`}
      />

      <div className="flex items-center justify-center py-8 print:p-0 w-full">
        <div className="rounded-xl shadow-lg print:shadow-none print:rounded-none">
          <PDFProfileFullContent profile={profile} className="w-full" />
        </div>
      </div>
    </div>
  );
}
