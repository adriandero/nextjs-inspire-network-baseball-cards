import { urlFor } from "@/lib/sanity/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { GoArrowLeft } from "react-icons/go";

import { SanityDocument } from "next-sanity";
import Link from "next/link";
import MobileNavMenu from "../MobileNavMenu";

export default function MobileNavBanner({
  profile,
  userProfileData,
}: SanityDocument): React.JSX.Element {
  return (
    <div className="w-full flex md:hidden">
      <div className="w-full h-fit bg-secondary flex flex-col md:hidden items-center relative">
        <div className="flex flex-row justify-between w-full p-4">
          <Link href="/dashboard">
            <GoArrowLeft
              size={32}
              strokeWidth="0"
              className="text-white hover:text-primary duration-200 mr-4"
            />
          </Link>
          <div className="flex flex-col items-center text-center hidden xs:inline ">
            <h1 className="text-2xl xs:text-3xl font-bold text-light1 ">
              {profile.name.toUpperCase()}
            </h1>
            <h1 className="text-xl xs:text-2xl font-bold text-primary text-center ">
              {profile.jobRole
                ? profile.jobRole.map((role: string, index: number) => (
                    <span key={index}>
                      {role}
                      {index < profile.jobRole.length - 1 && ", "}
                    </span>
                  ))
                : null}
            </h1>
          </div>
          <MobileNavMenu
            userProfileData={userProfileData}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
        </div>
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="text-2xl xs:text-3xl font-bold text-light1 xs:hidden">
            {profile.name.toUpperCase()}
          </h1>
          <h1 className="text-xl xs:text-2xl font-bold text-primary text-center xs:hidden">
            {profile.jobRole
              ? profile.jobRole.map((role: string, index: number) => (
                  <span key={index}>
                    {role}
                    {index < profile.jobRole.length - 1 && ", "}
                  </span>
                ))
              : null}
          </h1>
          <div className="w-36 h-36 rounded-full bg-secondary border-6 border-secondary mt-4 xs:mt-0 z-10 overflow-hidden">
            <Avatar>
              <AvatarImage
                src={
                  profile.profileImage
                    ? urlFor(profile.profileImage).toString()
                    : "/defaultAvatar.png"
                }
                className="rounded-full w-36 h-36 object-cover"
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="absolute bottom-0 w-full">
          <div className="bg-mainbackground h-6 w-full">
            {/* Card content goes here */}
          </div>
        </div>
      </div>
    </div>
  );
}
