import {
  getProfilesFromUserTeams,
  getTeamBySlug,
  ProfilesFromUserTeams,
} from "@/lib/utils/sanityApi/profileRequests";
// import { checkIfSession, getUserData } from "@/lib/utils/sessionCheck";
import { DataTable } from "@/components/profilesDataTable/data-table";
import NavBar from "@/components/NavBar";
import { SanityDocument } from "next-sanity";

import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
import { redirect } from "next/navigation";
import { profileColumns } from "@/components/profilesDataTable/profile-columns";

export interface Team {
  name: string;
  slug: string;
}
type tParams = Promise<{ slug: string }>;

export default async function TeamsPage({
  params,
}: {
  params: tParams;
}): Promise<JSX.Element> {
  const session = await auth0.getSession();
  const { slug } = await params;
  if (!session) {
    redirect("/auth/login");
  }

  const userData = session?.user;

  const userProfileData = await getUserData(userData);

  //TODO: put these functions ins a service or apirequest class because these call the api baseically
  async function fillAllProfilesFromUserTeams() {
    let profilesFromUserTeams: ProfilesFromUserTeams = { teamProfiles: [] };

    if (userProfileData?.team) {
      profilesFromUserTeams = await getProfilesFromUserTeams(
        userProfileData.email,
        [slug]
      );
    }

    return profilesFromUserTeams;
  }
  //TODO: put these functions ins a service or apirequest class because these call the api baseically

  async function fillDataTableProfileData() {
    const emptyData: SanityDocument[] = [];
    const data = userProfileData?.team
      ? (await fillAllProfilesFromUserTeams()).teamProfiles
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

      <main className="flex flex-wrap gap-8 justify-center">
        <DataTable
          columns={profileColumns}
          data={await fillDataTableProfileData()}
          team={(await getTeamBySlug(slug)) || undefined}
        />
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
