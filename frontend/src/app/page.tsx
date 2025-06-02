// import { checkIfSession, getUserData } from "@/lib/utils/sessionCheck";

import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/utils/sessionCheck";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoArrowRight } from "react-icons/go";

export default async function Home() {
  const session = await auth0?.getSession();

  if (!session) {
    redirect("/auth/login/");
  }
  const userData = await getUserData(session?.user);
  if (userData?.profile) {
    redirect("/tugcards/" + userData.profile.uuid);
  } else {
    //TODO:
    console.log(
      "Info: No dedicated TUG Card assigned. Ask an Admin to create your own TUG Card."
    );
    redirect("/browse");
  }
  return (
    <div className="container h-screen my-auto mx-auto w-fit p-8 flex items-center ">
      <div className="flex h-fit justify-center bg-secondary hover:bg-tertiary text-light1 font-bold py-2 px-4 rounded-lg ">
        <Link href="/browse" className="flex flex-row items-center gap-3">
          Go to Team List <GoArrowRight size={24} />
        </Link>
      </div>
    </div>
  );
}
