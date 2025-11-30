import { GoNorthStar } from "react-icons/go";
import ComponentShell from "../../components/custom-ui/component-shell";
import { Badge } from "@/src/components/shadcn-ui/badge";
import { Profile } from "@/src/shared/entities/profile";

interface ValuesCardProps {
  readonly profile: Profile;
}
export default function ValuesCard({
  profile,
}: ValuesCardProps): React.JSX.Element {
  return (
    <ComponentShell className="flex flex-row">
      <div className="flex w-fit h-fit xs:flex-nowrap flex-wrap">
        {" "}
        <div className="h-full mr-6 flex">
          <GoNorthStar strokeWidth={0.5} size={24} className="flex" />
        </div>
        <h1 className="text-xl font-bold flex-grow w-fit mr-6">Values</h1>
        {profile.values ? (
          <div className="flex flex-wrap gap-2 xs:mt-0 mt-4">
            {profile.values?.map((value: string, index: number) => (
              <Badge
                variant="outline"
                key={index}
                className="text-base font-bold"
              >
                {value}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex w-full h-fit italic items-center text-dark3 pt-1">
            {" "}
            <p>No Result.</p>
          </div>
        )}
      </div>
    </ComponentShell>
  );
}
