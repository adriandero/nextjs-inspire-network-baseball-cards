import { urlFor } from "@/sanity/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { GoArrowLeft, GoPerson } from "react-icons/go";

import { SanityDocument } from "next-sanity";
import Link from "next/link";
import HamburgerMenu from "../ui/HamburgerMenu";

export default function MobileNavBanner({
  profile,
}: SanityDocument): React.JSX.Element {
  return (
    <div className="w-full h-64 flex md:hidden ">
      <div className="w-full h-56 bg-secondary flex flex-col md:hidden  items-center p-6">
        <div className="flex flex-row items-center justify-between w-full">
          <Link href="/profiles">
            <GoArrowLeft
              size={32}
              strokeWidth="0"
              className="text-white mr-4"
            />
          </Link>
          <h1 className="text-3xl font-bold text-light1 text-center ">
            {profile.name.toUpperCase()}
          </h1>
          <HamburgerMenu className="ml-4" />
        </div>
        <h1 className="text-2xl font-bold text-primary text-center ">
          {profile.jobRole.map((role: string, index: number) => (
            <span key={index}>
              {role}
              {index < profile.jobRole.length - 1 && ", "}
            </span>
          ))}
        </h1>
        <div className="w-36 h-36 rounded-full border-6 border-secondary mt-4">
          <Avatar className="">
            <AvatarImage
              src={
                profile.profileImage
                  ? urlFor(profile.profileImage).toString()
                  : "/defaultAvatar.png"
              }
              className="rounded-full"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
