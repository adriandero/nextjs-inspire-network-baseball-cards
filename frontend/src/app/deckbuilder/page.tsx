import NavBar from "@/src/components/layout/nav-bar";

import { auth0 } from "@/src/lib/auth0";
import { getUserData } from "@/src/lib/utils/sessionCheck";
import { redirect } from "next/navigation";
import TeamProfileSelector from "@/src/features/deck-builder/profileSelection/teamProfileSelector";

export interface Team {
  name: string;
  slug: string;
}

export default async function DeckBuilderPage(): Promise<JSX.Element> {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userData = session?.user;

  const userProfileData = await getUserData(userData);

  return (
    <div className="w-full h-screen max-w-screen-lg ">
      <NavBar
        userProfileData={userProfileData}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />

      <main className="flex flex-row justify-center">
        <TeamProfileSelector userProfileData={userProfileData} />
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
