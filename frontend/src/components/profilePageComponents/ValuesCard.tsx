import { SanityDocument } from "next-sanity";

import { GoNorthStar } from "react-icons/go";
import { GoDash } from "react-icons/go";
import ComponentShell from "./ComponentShell";
import { Badge } from "@/components/ui/Badge";

export default function ValuesCard({
  profile,
}: SanityDocument): React.JSX.Element {
  return (
    <ComponentShell className="flex flex-row">
      <div className="h-full mr-6 hidden xs:flex">
        <GoNorthStar strokeWidth={0.5} size={24} className="flex self-start" />{" "}
      </div>
      <div className="flex w-fit h-fit items-start gap-4">
        <h1 className="text-xl font-bold flex-grow w-fit mr-2">Values</h1>

        <div className="hidden xs:flex flex-wrap gap-2">
          {profile.values
            .sort((x: string, y: string) => x.length - y.length)
            .map((value: string, index: number) => (
              <Badge
                variant="outline"
                key={index}
                className="text-base font-bold"
              >
                {value}
              </Badge>
            ))}
        </div>
      </div>

      <div className="flex xs:hidden flex-row ">
        <div className="h-full mr-6">
          <GoNorthStar
            strokeWidth={0.5}
            size={24}
            className="flex self-start"
          />{" "}
        </div>
        <div className="flex flex-col w-fit h-fit items-start">
          <h2 className="text-xl font-bold">Values:</h2>
          <div className="flex flex-wrap ">
            {profile.values.map((value: string, index: number) => (
              <div
                key={index}
                className="text-base font-bold text-base flex flex-row items-center"
              >
                {value}
                {index < profile.values.length - 1 && (
                  <GoDash strokeWidth={1.5} className="mx-2 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ComponentShell>
  );
}
