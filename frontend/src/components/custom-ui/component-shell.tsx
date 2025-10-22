type ShellProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ComponentShell({
  children,
  className,
}: ShellProps): React.JSX.Element {
  return (
    <div
      className={`w-full h-fit border bg-background sm:rounded-xl p-8 mt-4 ${className}`}
    >
      {children}
    </div>
  );
}
