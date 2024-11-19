import { getAllProfiles, getProfileBySlug } from "@/api/profileRequests";

import { GoPerson } from "react-icons/go";

import NavBar from "@/components/NavBar";
import Banner from "@/components/profilePageComponents/Banner";
import ValuesCard from "@/components/profilePageComponents/ValuesCard";
import MoreProfilesCard from "@/components/profilePageComponents/MoreProfilesCard";

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}): Promise<JSX.Element> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  console.log(profile);
  return (
    <div className="w-full h-screen max-w-screen-lg justify-self-center ">
      <NavBar />
      <Banner profile={profile} />
      <main className="flex mt-4">
        <div className="flex-grow mr-6 min-w-96">
          <ValuesCard profile={profile} />
        </div>
        <MoreProfilesCard profile={profile} />
      </main>
    </div>
  );
}
