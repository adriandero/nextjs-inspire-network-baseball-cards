import { SanityDocument } from "next-sanity";

import { GoNorthStar } from "react-icons/go";
import ComponentShell from "./ComponentShell";
import { Badge } from "@/components/ui/Badge";

export default function ValuesCard({
  profile,
}: SanityDocument): React.JSX.Element {
  return (
    <ComponentShell className="flex flex-row">
      <div className="flex w-fit h-fit items-start xs:flex-nowrap flex-wrap">
        <div className="h-full mr-6 flex">
          <GoNorthStar
            strokeWidth={0.5}
            size={24}
            className="flex self-start"
          />{" "}
        </div>
        <h1 className="text-xl font-bold flex-grow w-fit mr-6">Values</h1>

        <div className="flex flex-wrap gap-2 xs:mt-0 mt-4">
          {profile.values
            ?.map((value: string, index: number) => (
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

      {/* <div className="flex xs:hidden flex-row ">
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
      </div> */}
    </ComponentShell>
  );
}
