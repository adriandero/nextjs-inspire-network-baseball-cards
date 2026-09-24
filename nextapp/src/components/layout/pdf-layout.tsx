import Image from "next/image";
import INTMLogo from "@/public/images/in-tug-card-logo.png";
import { ProfileTable } from "@/src/features/deck-builder/entities/profile-table.model";
import { forwardRef } from "react";

interface PDFLayoutProps {
  title: string;
  isLoading: boolean;
  error?: string | null;
  completeProfileTables: ProfileTable[];
  children: React.ReactNode;
  className?: string;
}

export const PDFLayout = forwardRef<HTMLDivElement, PDFLayoutProps>(
  (
    {
      title,
      isLoading,
      error,
      completeProfileTables,
      children,
      className = "",
    },
    ref,
  ) => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "numeric",
      year: "numeric",
    });

    const containerClasses = `px-6 py-10 print:p-0 gap-4 flex flex-col max-w-[762px] w-[762px] max-h-[1123px] h-[1123px] ${className}`;

    if (error) {
      return (
        <div ref={ref} className={containerClasses} data-pdf-error={error}>
          <div className="text-red-500">Error: {error}</div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div ref={ref} className={containerClasses}>
          <div className="flex items-center text-center gap-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <span className="text-base ml-auto text-accent-foreground font-bold">
              {currentDate}
            </span>
            <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />
          </div>
          <div>Loading TUG Cards...</div>
        </div>
      );
    }

    const hasProfiles =
      completeProfileTables.length > 0 &&
      completeProfileTables.some((table) => table.profiles.length > 0);

    return (
      <div ref={ref} className={containerClasses} data-pdf-ready="true">
        <div className="flex items-center text-center gap-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <span className="text-base ml-auto text-accent-foreground font-bold">
            {currentDate}
          </span>
          <Image src={INTMLogo} width={70} height={150} alt="Company Logo" />
        </div>

        {!hasProfiles ? (
          <div>No TUG Cards found. Please select TUG Cards to compare.</div>
        ) : (
          children
        )}
      </div>
    );
  },
);

PDFLayout.displayName = "PDFLayout";
