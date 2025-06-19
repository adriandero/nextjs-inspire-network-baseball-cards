import ProfileNavBar from "@/components/ProfileNavBar";
import { CompareType } from "@/components/deckBuilder/deckBuilderStore";
import { ProfileComparison } from "@/components/deckBuilder/profileComparison";
import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type tParams = Promise<{ type: CompareType }>;

// Main page component with Suspense boundary
export default async function ComparisonPage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { type } = await params;
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userData = session?.user;

  const userProfileData = await getUserData(userData);

  return (
    <div className="w-full max-w-screen-lg">
      <ProfileNavBar
        userProfileData={userProfileData}
        backwardsNavigationUrl={"/deckbuilder/"}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileComparison initialType={type} />
      </Suspense>
    </div>
  );
}
