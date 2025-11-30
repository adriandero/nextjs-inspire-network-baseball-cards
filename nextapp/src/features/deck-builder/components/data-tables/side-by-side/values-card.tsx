import { SanityDocument } from "next-sanity";

import { GoNorthStar } from "react-icons/go";
import { Badge } from "@/src/components/shadcn-ui/badge";

export default function ValuesCard({
  profile,
}: SanityDocument): React.JSX.Element {
  return (
    <div className="w-full h-fit border border-light3 bg-background rounded-lg p-4">
      <div className="flex w-full h-fit xs:flex-nowrap flex-wrap flex-col gap-2">
        {" "}
        <div className="flex flex-row h-full mr-4  items-center">
          <GoNorthStar strokeWidth={0.5} size={20} className="flex mr-4" />
          <h1 className="text-lg font-bold flex-grow w-fit">Values</h1>
        </div>
        {profile.values ? (
          <div className="flex flex-wrap gap-2 xs:mt-0 mt-4">
            {profile.values?.map((value: string, index: number) => (
              <Badge
                variant="outline"
                key={index}
                className="text-sm font-semibold py-1 px-2"
              >
                {value}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex w-full h-fit italic items-center text-dark3 pt-1">
            {" "}
            <p className="ml-10">No Result.</p>
          </div>
        )}
      </div>
    </div>
  );
}
