import { SanityDocument } from "next-sanity";

import { GoNorthStar } from "react-icons/go";
import { Badge } from "../ui/Badge";

export default function PDFValuesCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  return (
    <div className={`${className}`}>
      <div className="flex flex-row w-full">
        <GoNorthStar
          strokeWidth={0.5}
          size={22}
          className="flex-shrink-0 mt-0.5"
        />
        <h2 className="ml-6 text-lg font-bold mb-3">Values</h2>
      </div>
      <div className="flex flex-wrap">
        {profile.values.map((value: string, index: number) => (
          <Badge
            variant="outline"
            key={index}
            className="text-xs font-bold mr-3 mb-2"
          >
            {value}
          </Badge>
        ))}
      </div>
    </div>
  );
}
