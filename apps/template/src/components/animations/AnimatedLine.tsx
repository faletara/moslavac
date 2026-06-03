import { cn } from "@/lib/utils";

interface AnimatedLineProps {
  className?: string;
  delay?: number;
  duration?: number;
  trigger?: "scroll" | "load";
}

/** Skeleton: no animation, no decorative color — inert spacer span. */
export function AnimatedLine({ className }: AnimatedLineProps) {
  return <span aria-hidden className={cn("block", className)} />;
}
