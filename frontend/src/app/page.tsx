import LandingPage from "@/src/components/layout/LandingPage";
import { auth0 } from "@/src/lib/auth0";
import { getUserData } from "@/src/lib/utils/sessionCheck";

import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth0?.getSession();

  if (!session) {
    redirect("/auth/login/");
  }

  const userData = await getUserData(session?.user);

  return (
    <>
      <LandingPage
        userProfileData={userData}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      ></LandingPage>
    </>
  );
}
