import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/shadcn-ui/table";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/src/components/shadcn-ui/button";
import { GoX } from "react-icons/go";
import defaultAvatar from "@/public/images/default-avatar.png";
import { ProfileIdentifierTable } from "@/src/features/deck-builder/entities/profile-identifier-table.model";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile";

interface ProfileDropTableProps {
  selectedProfilesData: ProfileWithDetailedTeams[];
  droppableId: string;
  onProfilesChange?: (profiles: ProfileWithDetailedTeams[]) => void;
  setSelectedTableId: (profileId: string) => void;
  table: ProfileIdentifierTable;
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

  const handleRemoveProfile = (profileId: string) => {
    if (onProfilesChange) {
      const updatedProfiles = selectedProfilesData.filter(
        (profile) => profile.uuid !== profileId
      );
      onProfilesChange(updatedProfiles);
    }
  };

  return (
    <div className="w-full ">
      {selectedProfilesData.length === 0 ? (
        <div
          ref={dropRef}
          className={`rounded-md flex justify-center border ${isOver ? "bg-primary/10 border-primary" : "bg-light1"} border rounded-md p-4 transition-colors min-h-24 hover:border-primary ${isSelectedTable ? "border-primary" : null}`}
          onClick={() => {
            setSelectedTableId(table.id);
          }}
        >
          <p className="text-dark3 self-center text-center">
            {isOver
              ? "Drop TUG Cards in here"
              : "Select a group and click card to select"}
          </p>
        </div>
      ) : (
        <div
          ref={dropRef}
          className={`rounded-md border ${isOver ? "bg-primary/10 border-primary" : "bg-light1"} border rounded-md max-h-[400px] overflow-y-auto transition-colors hover:border-primary ${isSelectedTable ? "border-primary" : null}`}
          onClick={() => {
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
                <TableRow key={profile.uuid} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={
                              profile.avatar?.asset?.url
                                ? profile.avatar?.asset?.url
                                : (profile.profileImage?.asset?.url ??
                                  defaultAvatar.src)
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
                      className="h-6 w-6 p-0 text-gray-400 hover:text-inspireRed transition-opacity duration-200 ease-in-out group-hover:opacity-100 opacity-0"
                      onClick={() => handleRemoveProfile(profile.uuid)}
                    >
                      <GoX size={32} strokeWidth="1" />
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
