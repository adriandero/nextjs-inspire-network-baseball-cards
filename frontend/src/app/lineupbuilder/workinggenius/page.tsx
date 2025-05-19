import NavBar from "@/components/NavBar";
import WorkingGeniusTable from "@/components/compare/dataTables/workingGeniusTable";
import { CompareType } from "@/components/lineupBuilder/lineupBuilderStore";
import { ProfileComparison } from "@/components/lineupBuilder/profileComparison";
import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Main page component with Suspense boundary
export default async function WorkingGeniusPage(): Promise<JSX.Element> {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userData = session?.user;

  const userProfileData = await getUserData(userData);

  return (
    <div className="w-full max-w-screen-lg">
      <NavBar
        userProfileData={userProfileData}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileComparison
          TableComponent={WorkingGeniusTable}
          tableTitle={CompareType.WORKING_GENIUS}
          tableSlug="workinggenius"
        />
      </Suspense>
    </div>
  );
}
