import { DataTable } from "@/src/features/browse/components/data-table";
import NavBar from "@/src/components/layout/nav-bar";

import { auth0 } from "@/src/lib/auth0";
import { redirect } from "next/navigation";
import { teamColumns } from "@/src/features/browse/columns/team-columns";
import { profileColumns } from "@/src/features/browse/columns/profile-columns";
import { getUserSanity } from "@/src/lib/data/users";

export interface Team {
  name: string;
  slug: string;
}

export default async function BrowsePage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userProfileData = await getUserSanity(session.user);

  if (!userProfileData) {
    return (
      <div className=" flex items-center justify-center">
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
    <div className=" max-w-screen-lg">
      <NavBar
        userProfileData={userProfileData}
      />
      <div className="flex flex-wrap gap-8 justify-center">
        <DataTable
          teamColumns={teamColumns}
          profileColumns={profileColumns}
        />
      </div>
    </div>
  );
}
