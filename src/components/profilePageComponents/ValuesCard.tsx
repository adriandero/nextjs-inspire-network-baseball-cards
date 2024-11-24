import { SanityDocument } from "next-sanity";
import CardHeader from "./CardHeader";
import { GoNorthStar } from "react-icons/go";
import { GoDash } from "react-icons/go";
import ComponentShell from "./ComponentShell";

export default function ValuesCard({
  profile,
}: SanityDocument): React.JSX.Element {
  return (
    <ComponentShell className="flex flex-row mt-0">
      <CardHeader title="Values:" icon={GoNorthStar} iconStrokeWidth={0.5} />
      <div className="flex flex-wrap pl-8 ">
        {profile.values.map((value: string, index: number) => (
          <div
            key={index}
            className="text-base font-bold text-lg flex flex-row items-center"
          >
            {value}
            {index < profile.values.length - 1 && (
              <GoDash strokeWidth={1.5} className="mx-2 text-primary" />
            )}
          </div>
        ))}
      </div>
    </ComponentShell>
  );
}
