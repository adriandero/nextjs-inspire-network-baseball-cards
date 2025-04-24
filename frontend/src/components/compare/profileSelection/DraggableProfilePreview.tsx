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
    <div className="p-3 bg-white rounded-md shadow-lg border border-gray-200 flex w-full w-[576px] justify-around text-center">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
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
        </div>
        <div className="font-medium text-base">{profile.name}</div>
      </div>
      {profile.jobRole && profile.jobRole.length > 0 && (
        <div className="text-sm text-gray-500 mt-1">
          {profile.jobRole.join(", ")}
        </div>
      )}
    </div>
  );
};

export default DraggedProfilePreview;
