import { cn } from "@/lib/utils";

interface RevealHeadingProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  staggerChildren?: number;
  ariaLabel?: string;
}

/** Skeleton: no reveal animation — plain heading lines. */
export function RevealHeading({
  lines,
  className,
  lineClassName,
  ariaLabel,
}: RevealHeadingProps) {
  const label = ariaLabel ?? lines.join(" ");
  return (
    <h2 aria-label={label} className={className}>
      {lines.map((line) => (
        <span key={line} className={cn("block", lineClassName)}>
          {line}
        </span>
      ))}
    </h2>
  );
}
