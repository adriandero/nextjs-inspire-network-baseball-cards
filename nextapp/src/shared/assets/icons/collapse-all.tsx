import React from "react";

export const CollapseAll = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.6243 4.17564C17.39 3.94132 17.0101 3.94132 16.7758 4.17564L12 8.95138L7.22431 4.17564C6.99 3.94133 6.6101 3.94133 6.37579 4.17564C6.14147 4.40995 6.14147 4.78985 6.37579 5.02417L11.5758 10.2242C11.8101 10.4585 12.19 10.4585 12.4243 10.2242L17.6243 5.02417C17.8586 4.78985 17.8586 4.40995 17.6243 4.17564Z"
      fill="#24292E"
      stroke="#2A2A2A"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.6243 19.8244C17.39 20.0587 17.0101 20.0587 16.7758 19.8244L12 15.0486L7.22431 19.8244C6.99 20.0587 6.6101 20.0587 6.37579 19.8244C6.14147 19.59 6.14147 19.2101 6.37579 18.9758L11.5758 13.7758C11.8101 13.5415 12.19 13.5415 12.4243 13.7758L17.6243 18.9758C17.8586 19.2101 17.8586 19.59 17.6243 19.8244Z"
      fill="#24292E"
      stroke="#2A2A2A"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
