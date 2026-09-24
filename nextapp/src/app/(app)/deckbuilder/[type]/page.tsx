import BackNavBar from "@/src/components/layout/back-nav-bar";
import { CompareTypes } from "@/src/features/deck-builder/entities/compare-types";
import { ProfileComparison } from "@/src/features/deck-builder/profile-comparison";
import { auth0 } from "@/src/lib/auth0";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getUserSanity } from "@/src/lib/data/queries/users";

type tParams = Promise<{ type: CompareTypes }>;

export default async function ComparisonPage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const { type } = await params;
  if (!Object.values(CompareTypes).includes(type)) notFound();
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
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileComparison initialType={type} />
      </Suspense>
    </div>
  );
}
