"use client";

import NavBar from "@/components/NavBar";
import { ProfileComparison } from "@/components/simpleCompareDataTable/profileComparison";
import WorkingGeniusTable from "@/components/simpleCompareDataTable/workingGeniusTable";
import { useEffect, useState } from "react";
import { SanityDocument } from "next-sanity";

// Client component with dynamic data loading
export default function WorkingGeniusClientPage({
  userData,
  userProfileData,
}: {
  userData: any;
  userProfileData: SanityDocument[];
}): JSX.Element {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure the component is mounted before rendering
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-screen-lg">
      <NavBar
        userProfileData={userProfileData}
        _id={""}
        _rev={""}
        _type={""}
        _createdAt={""}
        _updatedAt={""}
      />
      <ProfileComparison
        TableComponent={WorkingGeniusTable}
        ComponentTitle={"Working Genius"}
        initialProfiles={userProfileData}
      />
    </div>
  );
}
