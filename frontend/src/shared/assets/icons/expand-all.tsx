import React from "react";

export const ExpandAll = ({
  size = 24,
  strokeWidth = 1.5,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17.6243 10.2243C17.39 10.4586 17.0101 10.4586 16.7758 10.2243L12 5.44853L7.22431 10.2243C6.99 10.4586 6.6101 10.4586 6.37579 10.2243C6.14147 9.98995 6.14147 9.61005 6.37579 9.37574L11.5758 4.17574C11.8101 3.94142 12.19 3.94142 12.4243 4.17574L17.6243 9.37574C17.8586 9.61005 17.8586 9.98995 17.6243 10.2243Z"
      fill="#24292E"
      stroke="#2A2A2A"
      stroke-width="0.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17.6243 13.7757C17.39 13.5414 17.0101 13.5414 16.7758 13.7757L12 18.5515L7.22431 13.7757C6.99 13.5414 6.6101 13.5414 6.37579 13.7757C6.14147 14.0101 6.14147 14.39 6.37579 14.6243L11.5758 19.8243C11.8101 20.0586 12.19 20.0586 12.4243 19.8243L17.6243 14.6243C17.8586 14.39 17.8586 14.0101 17.6243 13.7757Z"
      fill="#24292E"
      stroke="#2A2A2A"
      stroke-width="0.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
