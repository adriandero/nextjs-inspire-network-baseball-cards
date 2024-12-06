"use client";



import { SanityDocument } from "next-sanity";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,

} from "./ui/Table";


import ProfileTableRow from "./ui/ProfileTableRow";

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
          <ProfileTableRow
            profile={profile}
            key={index}
            _id={""}
            _rev={""}
            _type={""}
            _createdAt={""}
            _updatedAt={""}
          />
        ))}
      </TableBody>
    </Table>
  );
}
