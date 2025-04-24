import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GoArrowRight } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { SanityDocument } from "next-sanity";
import { useDroppable } from "@dnd-kit/core";

// Import the enum for compare types
export enum CompareType {
  WORKING_GENIUS = "workinggenius",
  KOLBE_STRENGTHS = "kolbestrengths",
}

interface SelectedProfilesTableProps {
  selectedProfilesData: SanityDocument[];
  compareType: CompareType | null;
  onCompareTypeSelect: (type: CompareType) => void;
  onContinue: () => void;
}

const SelectedRenderTable: React.FC<SelectedProfilesTableProps> = ({
  selectedProfilesData,
  compareType,
  onCompareTypeSelect,
  onContinue,
}) => {
  const { setNodeRef: dropRef, isOver } = useDroppable({
    id: "selected-profiles-droppable",
  });

  const getCompareTypeDisplayName = (): string | null => {
    if (compareType === CompareType.WORKING_GENIUS) return "Working Genius";
    if (compareType === CompareType.KOLBE_STRENGTHS) return "Kolbe Strengths";
    return null;
  };

  return (
    <div>
      <div className="flex w-full items-center h-[68px]"></div>
      {selectedProfilesData.length === 0 ? (
        <div
          ref={dropRef}
          className={`rounded-md flex justify-center border ${isOver ? "bg-primary/10 border-primary" : "bg-light1"} border rounded-md p-4 transition-colors min-h-[100px]`}
        >
          <p className="text-dark3 self-center">
            {isOver
              ? "Drop profile here"
              : "Select or drag profiles to compare"}
          </p>
        </div>
      ) : (
        <div
          ref={dropRef}
          className={`rounded-md border ${isOver ? "bg-primary/10 border-primary" : "bg-light1"} border rounded-md max-h-[635.5px] overflow-y-scroll transition-colors`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProfilesData.map((profile) => (
                <TableRow key={profile.uuid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={
                              profile.profileImage
                                ? profile.profileImage.asset.url
                                : "/defaultAvatar.png"
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex justify-end pt-4 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <span>{getCompareTypeDisplayName() ?? "Compare Type"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuItem
              className="text-sm"
              onClick={() => onCompareTypeSelect(CompareType.WORKING_GENIUS)}
            >
              Working Genius
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-sm"
              onClick={() => onCompareTypeSelect(CompareType.KOLBE_STRENGTHS)}
            >
              Kolbe Strengths
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          disabled={selectedProfilesData.length === 0 || !compareType}
          className="hover:border-primary"
          size="sm"
          onClick={onContinue}
        >
          Continue <GoArrowRight size={24} />
        </Button>
      </div>
    </div>
  );
};

export default SelectedRenderTable;
