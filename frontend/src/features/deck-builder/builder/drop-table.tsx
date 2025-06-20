import React, { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { SanityDocument } from "next-sanity";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/src/components/ui/button";
import { GoX } from "react-icons/go";
import defaultAvatar from "@/public/images/default-avatar.png";
import { ProfileTable } from "./drop-table-manager";

interface ProfileDropTableProps {
  selectedProfilesData: SanityDocument[];
  droppableId: string;
  onProfilesChange?: (profiles: SanityDocument[]) => void;
  setSelectedTableId: (profileId: string) => void;
  table: ProfileTable;
  isSelectedTable: boolean;
}

const DropTable: React.FC<ProfileDropTableProps> = ({
  selectedProfilesData,
  droppableId,
  onProfilesChange,
  setSelectedTableId,
  table,
  isSelectedTable,
}) => {
  const { setNodeRef: dropRef, isOver } = useDroppable({
    id: droppableId,
  });

  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const handleRemoveProfile = (profileId: string) => {
    if (onProfilesChange) {
      const updatedProfiles = selectedProfilesData.filter(
        (profile) => profile.uuid !== profileId
      );
      onProfilesChange(updatedProfiles);
    }
  };

  return (
    <div>
      {selectedProfilesData.length === 0 ? (
        <div
          ref={dropRef}
          className={`rounded-md flex justify-center border ${isOver ? "bg-primary/10 border-primary" : "bg-light1"} border rounded-md p-4 transition-colors min-h-24 hover:border-primary ${isSelectedTable ? "border-primary" : null}`}
          onClick={() => {
            console.log("here:" + isSelectedTable);
            setSelectedTableId(table.id);
          }}
        >
          <p className="text-dark3 self-center">
            {isOver ? "Drop TUG Cards in here" : "Drag TUG Cards in here"}
          </p>
        </div>
      ) : (
        <div
          ref={dropRef}
          className={`rounded-md border ${isOver ? "bg-primary/10 border-primary" : "bg-light1"} border rounded-md max-h-[400px] overflow-y-auto transition-colors hover:border-primary ${isSelectedTable ? "border-primary" : null}`}
          onClick={() => {
            console.log("here:" + isSelectedTable);
            setSelectedTableId(table.id);
          }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProfilesData.map((profile) => (
                <TableRow
                  key={profile.uuid}
                  onMouseEnter={() => setHoveredRowId(profile.uuid)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={
                              profile.profileImage
                                ? profile.profileImage.asset.url
                                : defaultAvatar.src
                            }
                            alt={profile.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>

                      <div className="font-medium">{profile.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {profile.jobRole && profile.jobRole.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {profile.jobRole.join(", ")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-inspireRed"
                      onClick={() => handleRemoveProfile(profile.uuid)}
                    >
                      {hoveredRowId === profile.uuid && (
                        <GoX size={32} strokeWidth="1" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DropTable;
