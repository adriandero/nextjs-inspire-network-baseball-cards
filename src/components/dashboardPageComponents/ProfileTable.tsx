import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { SanityDocument } from "next-sanity";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/Table";

//import widgetimage from "@/../public/widgetIllustrations/WIDGET1.png";

export default function ProfileTable({
  profileArray,
}: SanityDocument): React.JSX.Element {
  return (
    <Table>
      <TableCaption>A list of your available profiles</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="flex flex-row items-center">
            Name <div className="table-cell md:hidden">, Role</div>
          </TableHead>
          <TableHead className="hidden md:table-cell">Role</TableHead>
          <TableHead className="flex flex-row items-center hidden xs:table-cell">
            Team <div className="block sm:hidden ">, Company</div>
          </TableHead>
          <TableHead className="text-right hidden sm:table-cell">
            Company
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profileArray?.map((profile: SanityDocument, index: number) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Link href={`/profiles/${profile.slug}`}>
                <div className="flex flex-row items-center gap-4">
                  <Avatar className="block">
                    <AvatarImage
                      src={
                        profile.profileImage?.asset.url ?? "/defaultAvatar.png"
                      }
                      width={40}
                      className="rounded-full"
                    />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-base">{profile.name}</p>
                    <div className="table-cell md:hidden">
                      {profile.jobRole}
                    </div>
                  </div>
                </div>
              </Link>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {profile.jobRole.map((role: string, index: number) => (
                <span key={index}>
                  {role}
                  {index < profile.jobRole.length - 1 && ", "}
                </span>
              ))}
            </TableCell>
            <TableCell className="hidden xs:table-cell">
              {profile.team?.name ?? <p className="text-red-400">null</p>}
              <div className="table-cell sm:hidden">
                {profile.team?.company.name ?? (
                  <p className="text-red-400">null</p>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right hidden sm:table-cell">
              {profile.team?.company.name ?? (
                <p className="text-red-400">null</p>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
