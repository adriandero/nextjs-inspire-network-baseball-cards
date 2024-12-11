import { getAllProfilesDashboardRowData } from "@/lib/utils/sanityApi/profileRequests";
import { checkIfSession } from "@/lib/utils/sessionCheck";
import { columns } from "@/components/profilesDataTable/columns";
import { DataTable } from "@/components/profilesDataTable/data-table";

export default async function ProfilePage(): Promise<JSX.Element> {
  await checkIfSession();

  const profiles = await getAllProfilesDashboardRowData();

  return (
    <div className="w-full h-screen max-w-screen-lg ">
      <main className="flex flex-wrap mt-4 gap-8 justify-center">
        <DataTable columns={columns} data={profiles} />
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
