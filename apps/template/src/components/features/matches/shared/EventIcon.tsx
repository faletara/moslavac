import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventIconProps {
  eventType: string;
  className?: string;
}

export function EventIcon({ eventType, className }: EventIconProps) {
  const t = eventType.toLowerCase();

  if (t.includes("žuti") || t.includes("zuti")) {
    return (
      <span
        role="img"
        aria-label="Žuti karton"
        className={cn("block h-3.5 w-2.5 rounded-[1px] bg-yellow-400", className)}
      />
    );
  }
  if (t.includes("crveni")) {
    return (
      <span
        role="img"
        aria-label="Crveni karton"
        className={cn("block h-3.5 w-2.5 rounded-[1px] bg-red-500", className)}
      />
    );
  }
  if (t.includes("zamjena")) {
    return (
      <ArrowLeftRight
        aria-label="Zamjena"
        className={cn("size-3.5 text-muted-foreground", className)}
      />
    );
  }
  if (t.includes("gol") || t.includes("goal")) {
    return (
      <span
        role="img"
        aria-label="Gol"
        className={cn("block size-2.5 rounded-full bg-foreground", className)}
      />
    );
  }

  return (
    <span
      className={cn("block size-1.5 rounded-full bg-muted-foreground", className)}
    />
  );
}
