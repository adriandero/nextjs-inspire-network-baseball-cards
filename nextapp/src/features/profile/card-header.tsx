import { IconType } from "react-icons";

export default function CardHeader({
  title,
  icon: Icon,
  iconStrokeWidth,
}: {
  title: string;
  icon: IconType;
  iconStrokeWidth: number;
}): React.JSX.Element {
  return (
    <div className="flex flex-row items-center w-fit h-fit">
      <Icon strokeWidth={iconStrokeWidth} size={24} />
      <h1 className="text-xl font-bold flex-grow w-fit ml-6">{title}</h1>
    </div>
  );
}
