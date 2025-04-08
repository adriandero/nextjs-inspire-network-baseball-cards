import NavBar from "@/components/NavBar";

import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
import { redirect } from "next/navigation";
import TeamProfileSelector from "@/components/simpleCompareDataTable/teamProfileSelector";

export interface Team {
  name: string;
  slug: string;
}

export default async function TeamsPage(): Promise<JSX.Element> {
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
