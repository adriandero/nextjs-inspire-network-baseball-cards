"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import INTMLogo from "@/public/images/in-tug-card-logo.png";
import ValuesTable from "@/src/features/deck-builder/data-tables/values-table";
import { useProfileComparisonHook } from "@/src/hooks/deck-builder/use-profile-comparison.hook";

function ProfileComparisonContent() {
  const searchParams = useSearchParams();
  const groupedProfiles = searchParams.get("groupedProfiles");
  const showJobRoleParam = searchParams.get("showJobRole");
  const showJobRole = showJobRoleParam === "true";

  const { isLoading, completeProfileTables, error } =
    useProfileComparisonHook(groupedProfiles);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "numeric",
    year: "numeric",
  });

  if (error) {
    return (
      <div className="px-6 py-10 print:p-0 gap-4 flex flex-col max-w-[762px] w-[762px] max-h-[1123px] h-[1123px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 print:p-0 gap-4 flex flex-col max-w-[762px] w-[762px] max-h-[1123px] h-[1123px]">
      <div className="flex items-center text-center gap-4">
        <h1 className="text-2xl font-bold">Values</h1>
        <span className="text-base ml-auto text-accent-foreground font-bold">
          {currentDate}
        </span>
        <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />
      </div>

      {isLoading ? (
        <div>Loading profiles...</div>
      ) : completeProfileTables.length === 0 ||
        completeProfileTables.every((table) => table.profiles.length === 0) ? (
        <div>No TUG Cards found. Please select TUG Cards to compare.</div>
      ) : (
        completeProfileTables.map((table) => (
          <div key={table.id} className="flex flex-col gap-4">
            {completeProfileTables.length > 1 && (
              <h2 className="text-base font-semibold">{table.name}</h2>
            )}
            <ValuesTable
              profiles={table.profiles}
              optimizedImages={true}
              showJobRole={showJobRole}
              tableName={"Values"}
            />
          </div>
        ))
      )}
    </div>
  );
}

function PDFProfileComparison() {
  return (
    <Suspense fallback={<div>Loading profiles...</div>}>
      <ProfileComparisonContent />
    </Suspense>
  );
}

export default function ValuesPDFPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex justify-center">
      <PDFProfileComparison />
    </div>
  );
}
