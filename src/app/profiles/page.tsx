import { getAllProfilesDashboardRowData } from "@/lib/utils/sanityApi/profileRequests";
import ProfileTable from "@/components/ProfileTable";
import { checkIfSession } from "@/lib/utils/sessionCheck";

export default async function ProfilePage(): Promise<JSX.Element> {
  await checkIfSession();

  const profiles = await getAllProfilesDashboardRowData();

  return (
    <div className="w-full h-screen max-w-screen-lg ">
      <main className="flex flex-wrap mt-4 gap-8">
        <ProfileTable
          profileArray={profiles}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
      </main>
      <footer className="flex item-center p-8"></footer>
    </div>
  );
}
