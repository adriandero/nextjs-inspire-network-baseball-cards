import NavBar from "@/components/NavBar";
import KolbeStrengthsTable from "@/components/compare/dataTables/kolbeStrengthsTable";
import { ProfileComparison } from "@/components/compare/profileComparison";
import { CompareType } from "@/components/deckBuilder/deckBuilderStore";
import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
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
