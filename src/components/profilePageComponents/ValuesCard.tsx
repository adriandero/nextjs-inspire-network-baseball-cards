import { GoPerson } from "react-icons/go";
import CardHeader from "./CardHeader";
import { GoNorthStar } from "react-icons/go";
import { GoDash } from "react-icons/go";

export default function ValuesCard({ profile }: any): React.JSX.Element {
  return (
    <div className="w-fit max-w-2xl min-w-96 h-fit border border-light3 rounded-2xl p-8 flex flex-row">
      <CardHeader title="Values:" icon={GoNorthStar} iconStrokeWidth={0.5} />
      <div className="flex flex-wrap pl-8 ">
        {profile.values.map((value: string, index: number) => (
          <div
            key={index}
            className="text-base font-bold text-lg flex flex-row items-center"
          >
            {value}{" "}
            {index < profile.values.length - 1 && (
              <GoDash strokeWidth={1.5} className="mx-2 text-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
