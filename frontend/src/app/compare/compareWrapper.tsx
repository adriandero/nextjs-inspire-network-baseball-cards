"use client";
import { CompareDataTable } from "@/components/compareDataTable/compare-data-table";
import { SelectedProfilesTable } from "@/components/compareDataTable/selectedProfilesTable";
import { profileColumns } from "@/components/profilesDataTable/profile-columns";
import { teamColumns } from "@/components/profilesDataTable/team-columns";
import { ColumnDef } from "@tanstack/react-table";
import { SanityDocument } from "next-sanity";
import React from "react";

// Sample data for the table
// const people = [
//   { name: "John Doe", role: "Software Engineer" },
//   { name: "Jane Smith", role: "Product Manager" },
//   { name: "Alex Johnson", role: "UX Designer" },
//   { name: "Sarah Williams", role: "Data Scientist" },
//   { name: "Michael Brown", role: "Marketing Specialist" },
// ];

interface CompareWrapperProps<TData, TValue> {
  teamColumns: ColumnDef<TData, TValue>[];
  profileColumns: ColumnDef<TData, TValue>[];
  teamsData: TData[];
  userProfileData: SanityDocument;
}

export function CompareWrapper<TData, TValue>({
  teamColumns,
  profileColumns,
  teamsData,
  userProfileData,
}: CompareWrapperProps<TData, TValue>) {
  const [selectedProfiles, setSelectedProfiles] = React.useState<
    SanityDocument[]
  >([]);

  return (
    <>
      <CompareDataTable
        teamColumns={teamColumns}
        profileColumns={profileColumns}
        teamsData={teamsData}
        userProfileData={userProfileData}
      />
      <SelectedProfilesTable profiles={selectedProfiles} />
    </>
  );
}
