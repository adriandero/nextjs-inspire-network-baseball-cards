import { SanityDocument } from "next-sanity";


import { GoNorthStar } from "react-icons/go";
import { GoDash } from "react-icons/go";

export default function PDFValuesCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  return (
    <div className={`${className}`}>
      <div className="flex flex-row w-full h-full">
        <div className="h-full mr-6">
          <GoNorthStar
            strokeWidth={0.5}
            size={22}
            className="flex self-start mt-0.5"
          />
        </div>
        <div className="flex flex-col w-full h-full">
          <h2 className="text-lg font-bold">Values</h2>
          <div className="mt-2 flex flex-row w-full flex-wrap">
            {profile.values.map((value: string, index: number) => (
              <div
                key={index}
                className="text-base font-bold flex items-center"
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
    </div>
  );
}
