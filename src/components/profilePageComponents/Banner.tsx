import { urlFor } from "@/sanity/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { GoPerson } from "react-icons/go";
import Image from "next/image";

import widgetimage from "@/../public/widgetIllustrations/WIDGET1.png";

export default function Banner({ profile }: any): React.JSX.Element {
  console.log(profile.team.company.companyLogo.asset.url);
  console.log(urlFor(profile.team.company.companyLogo).toString());
  return (
    <div className="w-full max-h-48 h-full bg-secondary rounded-2xl flex items-center px-20">
      {profile.profileImage ? (
        <div className="w-32 h-32 rounded-full mr-12 flex justify-center">
          <Avatar className="">
            <AvatarImage
              src={urlFor(profile.profileImage).toString()}
              className="rounded-full"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="w-32 h-32 rounded-full bg-light3 mr-12 flex justify-center items-center">
          <GoPerson className="text-6xl text-dark3" />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-light1">
          {profile.name.toUpperCase()}
        </h1>
        <h1 className="text-2xl font-bold text-primary">{profile.jobRole}</h1>
      </div>

      <Image
        src={profile.team.company.companyLogo.asset.url}
        layout="intrinsic"
        width={220}
        height={220}
        alt="Company Logo"
        className="ml-auto"
      />
    </div>
  );
}
