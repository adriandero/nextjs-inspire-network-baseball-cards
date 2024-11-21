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

export default async function ProfilePage(): Promise<JSX.Element> {
  const profiles = await getAllProfilesDashboardRowData();
  console.log(profiles);

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
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex flex-row items-center gap-4">
                  <Avatar className="block">
                    <AvatarImage
                      src={profiles[1].profileImage.asset.url}
                      width={40}
                      className="rounded-full"
                    />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-base">{profiles[1].name}</p>
                </div>
              </TableCell>
              <TableCell>{profiles[1].jobRole}</TableCell>
              <TableCell>{profiles[1].team.name}</TableCell>
              <TableCell className="text-right">
                {profiles[1].team.company.name}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
