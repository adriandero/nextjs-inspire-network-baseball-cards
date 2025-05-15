"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { SanityDocument } from "next-sanity";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function ProfileTableRow({
  profile,
}: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link href={`/profiles/${profile.uuid}`}>
          <div className="flex flex-row items-center gap-4">
            <Avatar className="block">
              <AvatarImage
                src={profile.profileImage?.asset.url ?? "/defaultAvatar.png"}
                onLoadingStatusChange={(status) => {
                  if (status === "loaded") {
                    setIsAvatarLoaded(true);
                  }
                }}
                width={40}
                className="rounded-full"
              />
              {!isAvatarLoaded ? (
                <Skeleton
                  className={`min-h-[40px] min-w-[40px] rounded-full bg-light3`}
                />
              ) : null}
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-base">{profile.name}</p>
              <div className="table-cell md:hidden">{profile.jobRole}</div>
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
          {profile.team?.company.name ?? <p className="text-red-400">null</p>}
        </div>
      </TableCell>
      <TableCell className="text-right hidden sm:table-cell">
        {profile.team?.company.name ?? <p className="text-red-400">null</p>}
      </TableCell>
    </TableRow>
  );
}
