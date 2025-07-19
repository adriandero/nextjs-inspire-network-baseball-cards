import Link from "next/link";
import { Button } from "@/src/components/shadcn-ui/button";
import { ReactNode, MouseEventHandler } from "react";

interface LinkButtonProps {
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  children: ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  prefetch?: boolean;
  disabled?: boolean;
  external?: boolean;
}

/**
 * LinkButton - A component that renders either a Link or Button based on props
 *
 * Use cases:
 * - href provided: renders as Next.js Link with button styling
 * - only onClick: renders as Button
 * - external links: renders as regular anchor
 */
export function LinkButton({
  href,
  onClick,
  children,
  variant = "default",
  className,
  prefetch = false,
  disabled = false,
  external = false,
  ...props
}: LinkButtonProps) {
  const buttonClasses = `${className} justify-start inline-flex w-full text-muted-foreground transition-colors text-base !ring-0 `;
  if (href && !external && !disabled) {
    return (
      <Link
        href={href}
        prefetch={prefetch}
        className={`inline-flex w-full`}
      >
        <Button
          variant={variant}
          className={buttonClasses}
          onClick={onClick}
          asChild
          {...props}
        >
          <span>{children}</span>
        </Button>
      </Link>
    );
  }

  if (href && external && !disabled) {
    return (
      <Button
        variant={variant}
        className={buttonClasses}
        onClick={onClick}
        asChild
        {...props}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </Button>
  );
}
