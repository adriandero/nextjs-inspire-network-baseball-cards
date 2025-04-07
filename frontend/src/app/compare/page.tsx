import {
  getAllTeams,
  getUserTeams,
  TeamsFromUser,
} from "@/lib/utils/sanityApi/profileRequests";
import { DataTable } from "@/components/profilesDataTable/data-table";
import NavBar from "@/components/NavBar";
import { SanityDocument } from "next-sanity";

import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
import { redirect } from "next/navigation";
import { teamColumns } from "@/components/profilesDataTable/team-columns";
import { profileColumns } from "@/components/profilesDataTable/profile-columns";
import { CompareDataTable } from "@/components/compareDataTable/compare-data-table";
import { SelectedProfilesTable } from "@/components/compareDataTable/selectedProfilesTable";
import { CompareWrapper } from "./compareWrapper";
import { compactProfileColumns } from "@/components/compareDataTable/compact-profile-columns";
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

  //TODO: put these functions ins a service or apirequest class because these call the api baseically
  async function fillAllUserTeams() {
    let profilesFromUserTeams: TeamsFromUser = { teams: [] };

    if (userProfileData?.team) {
      profilesFromUserTeams = await getUserTeams(userProfileData.email);
    }

    return profilesFromUserTeams;
  }

  //TODO: put these functions ins a service or apirequest class because these call the api baseically

  async function fillDataTableTeamData() {
    const emptyData: SanityDocument[] = [];
    if (userProfileData.permission === "Admin") {
      return await getAllTeams();
    }
    const data = userProfileData?.team
      ? (await fillAllUserTeams()).teams
      : emptyData;

    return data;
  }

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
