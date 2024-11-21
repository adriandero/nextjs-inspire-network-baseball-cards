import { getAllProfilesDashboardRowData } from "@/api/profileRequests";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { SanityDocument } from "next-sanity";
import Link from "next/link";

export default async function ProfilePage(): Promise<JSX.Element> {
  const profiles = await getAllProfilesDashboardRowData();

  return (
    <div className="w-full h-screen max-w-screen-lg justify-self-center">
      <main className="flex flex-wrap mt-4 gap-8">
        <Table>
          <TableCaption>A list of your available profiles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile: SanityDocument, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <Link href={`/profiles/${profile.slug}`}>
                    <div className="flex flex-row items-center gap-4">
                      <Avatar className="block">
                        <AvatarImage
                          src={
                            profile.profileImage?.asset.url
                              ? profile.profileImage?.asset.url
                              : "/defaultAvatar.png"
                          }
                          width={40}
                          className="rounded-full"
                        />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <p className="font-bold text-base">{profile.name}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>{profile.jobRole}</TableCell>
                <TableCell>
                  {profile.team?.name ? (
                    profile.team?.name
                  ) : (
                    <p className="text-red-400">null</p>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {profile.team?.company.name ? (
                    profile.team?.company.name
                  ) : (
                    <p className="text-red-400">null</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
