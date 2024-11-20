import { GoPerson } from "react-icons/go";
import CardHeader from "./CardHeader";
import { GoPeople } from "react-icons/go";

export default function MoreProfilesCard({ profile }: any): React.JSX.Element {
  return (
    <div className="rounded-2xl w-full max-w-80 h-fit border border-light3 p-8">
      <CardHeader title="More Profiles" icon={GoPeople} iconStrokeWidth={1} />
    </div>
  );
}
