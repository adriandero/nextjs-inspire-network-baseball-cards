/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button } from "@/components/ui/button";
import { SanityDocument } from "next-sanity";
import ProfileDropTable from "./ProfileDropTable";
import { GoX } from "react-icons/go";

export interface ProfileTable {
  id: string;
  profiles: string[];
  name: string;
}

interface ProfileTablesManagerProps {
  profileTables: ProfileTable[];
  onRemoveTable: (tableId: string) => void;
  onUpdateTableProfiles: (tableId: string, profiles: string[]) => void;
  onCreateTableWithProfile: (profileId: string) => void;
  allProfiles: SanityDocument[];
}

const ProfileTablesManager: React.FC<ProfileTablesManagerProps> = ({
  profileTables,
  onRemoveTable,
  onUpdateTableProfiles,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreateTableWithProfile,
  allProfiles,
}) => {
  const getProfilesForTable = (tableId: string) => {
    const table = profileTables.find((t) => t.id === tableId);
    if (!table) return [];

    return allProfiles.filter((profile) =>
      table.profiles.includes(profile.uuid)
    );
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {profileTables.map((table, index) => (
        <React.Fragment key={table.id}>
          <div className="flex justify-end gap-3">
            <div className="font-medium text-base flex items-center">
              <span>
                {index + 1} - {table.name}
              </span>
            </div>
            {profileTables.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-inspireRed w-6 h-6"
                onClick={() => onRemoveTable(table.id)}
              >
                <GoX size={32} strokeWidth="1" />
              </Button>
            )}
          </div>

          <ProfileDropTable
            selectedProfilesData={getProfilesForTable(table.id)}
            droppableId={`table-${table.id}`}
            onProfilesChange={(profiles: any) => {
              const profileIds = profiles.map((p: any) => p.uuid);
              onUpdateTableProfiles(table.id, profileIds);
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProfileTablesManager;
