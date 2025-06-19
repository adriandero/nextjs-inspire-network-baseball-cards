import NavBar from "@/src/components/layout/nav-bar";
import KolbeStrengthsTable from "@/src/features/deck-builder/data-tables/kolbe-strengths-table";
import { ProfileComparison } from "@/src/features/compare/profileComparison";
import { CompareType } from "@/src/features/deck-builder/types/compare-type";
import { auth0 } from "@/src/lib/auth0";
import { getUserData } from "@/src/lib/utils/sessionCheck";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Main page component with Suspense boundary
export default async function KolbeStrengthsPage(): Promise<JSX.Element> {
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
          TableComponent={KolbeStrengthsTable}
          tableTitle={CompareType.KOLBE_STRENGTHS}
          tableSlug="kolbestrengths"
        />
      </Suspense>
    </div>
  );
}
