import { getProfileBySlug } from "@/api/profileRequests";

import NavBar from "@/components/NavBar";
import Banner from "@/components/profilePageComponents/Banner";
import ValuesCard from "@/components/profilePageComponents/ValuesCard";
import MoreProfilesCard from "@/components/profilePageComponents/MoreProfilesCard";
import WorkingGeniusCard from "@/components/profilePageComponents/WorkingGeniusCard";
import PrinciplesYouCard from "@/components/profilePageComponents/PrinciplesYouCard";

export default async function ProfilePage({
  params,
}: {
  params: { slug: string };
}): Promise<JSX.Element> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  console.log(profile);
  return (
    <div className="w-full h-screen max-w-screen-lg justify-self-center">
      <NavBar />
      <Banner profile={profile} />
      <main className="flex flex-wrap mt-4 gap-8">
        <div className="flex flex-col grow shrink-0 basis-1/2 min-w-96">
          <ValuesCard profile={profile} />
          <WorkingGeniusCard profile={profile} />
          <PrinciplesYouCard profile={profile}/>
        </div>
        <MoreProfilesCard profile={profile} />
      </main>
    </div>
  );
}
