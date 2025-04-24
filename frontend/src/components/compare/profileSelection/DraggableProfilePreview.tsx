import React from "react";
import Image from "next/image";
import { SanityDocument } from "next-sanity";

interface DraggedProfilePreviewProps {
  profile: SanityDocument;
}

const DraggedProfilePreview: React.FC<DraggedProfilePreviewProps> = ({
  profile,
}) => {
  if (!profile) return null;

  return (
    <div className="p-3 bg-white rounded-md shadow-lg border border-gray-200 grid grid-cols-2 w-full w-[576px] text-center pl-16">
      <div className="grid grid-cols-[auto_1fr] items-center gap-3 justify-self-start">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={
              profile.profileImage
                ? profile.profileImage.asset.url
                : "/defaultAvatar.png"
            }
            alt={profile.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="font-medium text-base">{profile.name}</div>
      </div>
      {profile.jobRole && profile.jobRole.length > 0 && (
        <div className="text-sm text-gray-500 mt-1 justify-self-start self-center">
          {profile.jobRole.join(", ")}
        </div>
      )}
    </div>
  );
};

export default DraggedProfilePreview;
