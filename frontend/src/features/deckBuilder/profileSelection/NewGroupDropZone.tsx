import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface NewGroupDropZoneProps {
  isLastItem?: boolean;
}

const NewGroupDropZone: React.FC<NewGroupDropZoneProps> = ({
  isLastItem = false,
}) => {
  const { setNodeRef: dropRef, isOver } = useDroppable({
    id: "new-group-creator",
  });

  return (
    <div
      ref={dropRef}
      className={`
        ${isLastItem ? "mt-6" : "my-4"} 
        border-2 border-dashed rounded-md 
        ${isOver ? "border-primary bg-primary/10" : "border-gray-300"} 
        h-24 flex items-center justify-center transition-colors
        cursor-pointer
      `}
    ></div>
  );
};

export default NewGroupDropZone;
