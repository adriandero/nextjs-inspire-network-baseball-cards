import LandingPage from "@/src/components/layout/landing-page";
import { auth0 } from "@/src/lib/auth0";
import { redirect } from "next/navigation";
import { getUserSanity } from "@/src/lib/data/users";

export default async function Home() {
  const session = await auth0?.getSession();

  if (!session) {
    redirect("/auth/login/");
  }

  const userData = await getUserSanity(session?.user);

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
