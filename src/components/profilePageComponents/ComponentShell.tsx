type ShellProps = {
  children: React.ReactNode;
  className?: string; // Optional for extra styling
};

export default function ComponentShell({
  children,
  className,
}: ShellProps): React.JSX.Element {
  return (
    <div
      className={`max-w-2xl w-full h-fit border border-light3 bg-background sm:rounded-2xl p-8 mt-6 ${className}`}
    >
      {children}
    </div>
  );
}
