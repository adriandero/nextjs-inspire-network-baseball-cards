import {
  getProfilesFromUserTeams,
  ProfilesFromUserTeams,
} from "@/lib/utils/sanityApi/profileRequests";
import { checkIfSession, getUserData } from "@/lib/utils/sessionCheck";
import { columns } from "@/components/profilesDataTable/columns";
import { DataTable } from "@/components/profilesDataTable/data-table";
import NavBar from "@/components/NavBar";
import { SanityDocument } from "next-sanity";

export interface Team {
  name: string;
  slug: string;
}

export default async function DashboardPage(): Promise<JSX.Element> {
  await checkIfSession();

  const userData = await getUserData();

  const emptyData: SanityDocument[] = [];
  let profilesFromUserTeams: ProfilesFromUserTeams = { teamProfiles: [] };

  if (userData?.team) {
    profilesFromUserTeams = await getProfilesFromUserTeams(
      userData.email,
      userData.team.map((team: Team) => team.name)
    );
  }

  const data = userData?.team ? profilesFromUserTeams.teamProfiles : emptyData;
  console.log(data);

  return (
    <div className="w-full h-screen max-w-screen-lg ">
      <NavBar
        userDataProfile={userData.profile}
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
