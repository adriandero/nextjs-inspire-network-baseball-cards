import { urlFor } from "@/lib/sanity/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import { SanityDocument } from "next-sanity";

//import widgetimage from "@/../public/widgetIllustrations/WIDGET1.png";

export default function PDFBanner({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  console.log(profile);
  return (
    <div className={`${className} w-full items-center`}>
      <div className="w-24 h-24 rounded-full mr-12 flex justify-center overflow-hidden">
        <Avatar className="">
          <AvatarImage
            src={
              profile.profileImage
                ? urlFor(profile.profileImage).toString()
                : "/defaultAvatar.png"
            }
            className="rounded-full w-24 h-24 object-cover"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-light1">
          {profile.name.toUpperCase()}
        </h1>
        <h1 className="text-xl font-bold text-primary">
          {profile.jobRole.map((role: string, index: number) => (
            <span key={index}>
              {role}
              {index < profile.jobRole.length - 1 && ", "}
            </span>
          ))}
        </h1>
      </div>

      {profile?.team && profile?.team[0]?.company?.companyLogo?.asset.url ? (
        <Image
          src={profile?.team[0]?.company?.companyLogo?.asset.url}
          width={180}
          height={180}
          alt="Company Logo"
          className="ml-auto"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
