import BackNavBar from "@/src/components/layout/back-nav-bar";
import { CompareTypes } from "@/src/features/deck-builder/entities/compare-types";
import { ProfileComparison } from "@/src/features/deck-builder/profile-comparison";
import { auth0 } from "@/src/lib/auth0";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getUserSanity } from "@/src/lib/data/users";

type tParams = Promise<{ type: CompareTypes }>;

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

  const userProfileData = await getUserSanity(userData);

  return (
    <div className="w-full max-w-screen-lg">
      <BackNavBar
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
