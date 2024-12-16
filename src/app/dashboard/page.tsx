import {
  getProfilesFromUserTeams,
  ProfilesFromUserTeams,
} from "@/lib/utils/sanityApi/profileRequests";
// import { checkIfSession, getUserData } from "@/lib/utils/sessionCheck";
import { columns } from "@/components/profilesDataTable/columns";
import { DataTable } from "@/components/profilesDataTable/data-table";
import NavBar from "@/components/NavBar";
import { SanityDocument } from "next-sanity";

import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
import { redirect } from "next/navigation";

export interface Team {
  name: string;
  slug: string;
}

export default async function DashboardPage(): Promise<JSX.Element> {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userData = session?.user;

  let profilesFromUserTeams: ProfilesFromUserTeams = { teamProfiles: [] };

  const userProfileData = await getUserData(userData);
  if (userProfileData?.team) {
    profilesFromUserTeams = await getProfilesFromUserTeams(
      userProfileData.email,
      userProfileData.team.map((team: Team) => team.name)
    );
  }

  const emptyData: SanityDocument[] = [];

  const data = userProfileData?.team
    ? profilesFromUserTeams.teamProfiles
    : emptyData;

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

      <main className="flex flex-wrap mt-4 gap-8 justify-center">
        <DataTable columns={columns} data={data} />
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
