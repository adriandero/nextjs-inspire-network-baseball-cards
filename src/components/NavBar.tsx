import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
//import { useSession } from "next-auth/react";

import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";

export default function NavBar(): React.JSX.Element {
  // const { data: session, status } = useSession();
  const userProfilePic = "/defaultAvatar.png";

  return (
    <div className="w-full h-16 hidden md:flex justify-between items-center justify-self-center px-6">
      <Link href={`/profiles/`}>
        <GoArrowLeft size={32} strokeWidth="0" />
      </Link>
      <div className="flex space-x-12 text-xl h-full items-center font-medium">
        <Link href={`/profiles`}>Home</Link>
        <h1>Teams</h1>
        <h1>Assessment</h1>
        <h1 className="flex flex-row items-center gap-2">
          <Avatar className="h-full">
            <AvatarImage src={userProfilePic} className="rounded-full h-8" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          Profile
        </h1>
      </div>
    </div>
  );
}
