interface PlayerGridProps {
  children: React.ReactNode;
}

export function PlayerGrid({ children }: PlayerGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-8">
      {children}
    </div>
  );
}

export function PlayerGridItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
