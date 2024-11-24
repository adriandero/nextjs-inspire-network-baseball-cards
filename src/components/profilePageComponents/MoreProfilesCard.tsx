import { GoPeople } from "react-icons/go";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { SanityDocument } from "next-sanity";
import ComponentShell from "./ComponentShell";

export default function MoreProfilesCard({
  moreProfiles,
}: SanityDocument): React.JSX.Element {
  console.log(moreProfiles);
  return (
    <ComponentShell className="md:max-w-80 mt-0">
      <div className="flex flex-row items-center w-fit h-fit">
        <GoPeople strokeWidth={1} size={24} />
        <h1 className="text-xl font-bold flex-grow w-fit ml-6">
          More Profiles
        </h1>
      </div>
      {moreProfiles.map((profile: SanityDocument, index: number) => (
        <div className="pt-6" key={index}>
          <Link href={`/profiles/${profile.slug.current}`}>
            <div className="flex flex-row items-center gap-4">
              <Avatar className="block">
                <AvatarImage
                  src={profile.profileImage?.asset?.url ?? "/defaultAvatar.png"}
                  width={50}
                  className="rounded-full"
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold ">{profile.name}</p>
                <p className=" ">{profile.jobRole}</p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </ComponentShell>
  );
}
