import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  once?: boolean;
}

/** Skeleton: no animation — plain wrapper. */
export function FadeInView({ children, className }: FadeInViewProps) {
  return <div className={cn(className)}>{children}</div>;
}
