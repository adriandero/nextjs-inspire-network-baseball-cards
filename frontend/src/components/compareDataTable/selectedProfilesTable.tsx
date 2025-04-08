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
interface SelectedProfilesTableProps {
  profiles: SanityDocument[];
}

export function SelectedProfilesTable({
  profiles,
}: SelectedProfilesTableProps) {
  return (
    <div className="w-2/5">
      {/* Card-like container */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm w-full">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-gray-50/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile: SanityDocument, index: number) => (
                <tr
                  key={index}
                  className="border-b transition-colors hover:bg-gray-50/50"
                >
                  <td className="p-4 align-middle font-medium">
                    {profile.name}
                  </td>
                  <td className="p-4 align-middle text-gray-600">
                    {profile.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
