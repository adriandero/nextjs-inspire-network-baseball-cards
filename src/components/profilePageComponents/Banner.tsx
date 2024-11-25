import { urlFor } from "@/sanity/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import { SanityDocument } from "next-sanity";

//import widgetimage from "@/../public/widgetIllustrations/WIDGET1.png";

export default function Banner({ profile }: SanityDocument): React.JSX.Element {
  return (
    <div className="w-full h-48 bg-secondary rounded-2xl hidden md:flex items-center px-20">
      <div className="w-32 h-32 min-w-32 rounded-full mr-12 flex justify-center">
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

      <div>
        <h1 className="text-3xl font-bold text-light1">
          {profile.name.toUpperCase()}
        </h1>
        <h1 className="text-2xl font-bold text-primary">
          {profile.jobRole.map((role: string, index: number) => (
            <span key={index}>
              {role}
              {index < profile.jobRole.length - 1 && ", "}
            </span>
          ))}
        </h1>
      </div>

      {profile?.team?.company?.companyLogo?.asset.url ? (
        <Image
          src={profile?.team?.company?.companyLogo?.asset.url}
          width={220}
          height={220}
          alt="Company Logo"
          className="ml-auto"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
