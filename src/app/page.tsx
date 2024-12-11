import { checkIfSession } from "@/lib/utils/sessionCheck";

import Link from "next/link";
import { GoArrowRight } from "react-icons/go";

export default async function Home() {
  await checkIfSession();

  return (
    <main className="container h-screen my-auto mx-auto w-fit p-8 flex items-center ">
      <div className="flex h-fit justify-center bg-secondary hover:bg-tertiary text-light1 font-bold py-2 px-4 rounded-lg ">
        <Link href="/dashboard/" className="flex flex-row items-center gap-3">
          Go to Profile Dashboard <GoArrowRight size={24} />
        </Link>
      </div>
    </main>
  );
}
