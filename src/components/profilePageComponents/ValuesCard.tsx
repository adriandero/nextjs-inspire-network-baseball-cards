import { SanityDocument } from "next-sanity";

import { GoNorthStar } from "react-icons/go";
import { GoDash } from "react-icons/go";
import ComponentShell from "./ComponentShell";

export default function ValuesCard({
  profile,
}: SanityDocument): React.JSX.Element {
  return (
    <ComponentShell className="flex flex-row">
      <div className="hidden xs:flex flex-row items-center w-fit h-fit">
        <GoNorthStar strokeWidth={0.5} size={24} className="flex self-start" />{" "}
        <h1 className="text-xl font-bold flex-grow w-fit ml-6">Values</h1>
      </div>
      <div className="hidden xs:flex flex-wrap pl-8 ">
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
