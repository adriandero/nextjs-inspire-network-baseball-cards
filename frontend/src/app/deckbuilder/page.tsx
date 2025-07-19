import NavBar from "@/src/components/layout/nav-bar";

import { auth0 } from "@/src/lib/auth0";
import { redirect } from "next/navigation";
import BuilderContext from "@/src/features/deck-builder/builder/builder-context";
import { getUserSanity } from "@/src/lib/data/users";

export interface Team {
  name: string;
  slug: string;
}

export default async function DeckBuilderPage(): Promise<JSX.Element> {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userData = session?.user;

  const userProfileData = await getUserSanity(userData);

  if (!userProfileData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900">
            User Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            Your account is not found in our system.
          </p>
          <p className="text-gray-600">
            Please contact the administrator for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen max-w-screen-lg ">
      <NavBar userProfileData={userProfileData} />

      <main className="flex flex-row justify-center">
        <BuilderContext />
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
