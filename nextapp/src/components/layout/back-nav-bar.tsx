"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { NAV_ITEMS } from "@/src/constants/navigation";
import AccountDropdown from "@/src/components/custom-ui/account-dropdown";
import { UserSanity } from "@/src/shared/entities/user.types";
import React from "react";

interface BackNavBarProps {
  readonly userProfileData?: UserSanity;
  readonly backwardsNavigationUrl: string;
  readonly className?: string;
}

export default function BackNavBar({
  userProfileData,
  backwardsNavigationUrl,
  className,
}: Readonly<BackNavBarProps>): React.JSX.Element {
  const router = useRouter();

  function handleBack() {
    router.push(backwardsNavigationUrl);
  }

  return (
    <div
      className={`${className} flex w-full h-16 justify-between items-center justify-self-center px-6`}
    >
      <GoArrowLeft
        size={28}
        strokeWidth="0.5"
        onClick={handleBack}
        className="text-dark1 hover:text-primary hover:scale-110 duration-200 cursor-pointer"
      />

      <div className="flex space-x-12 text-lg h-full items-center font-medium">
        {NAV_ITEMS.slice()
          .reverse()
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary duration-200"
              {...(item.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {item.label}
            </Link>
          ))}

        <AccountDropdown userProfileData={userProfileData} />
      </div>
    </div>
  );
}
