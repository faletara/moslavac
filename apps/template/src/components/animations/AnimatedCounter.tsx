interface AnimatedCounterProps {
  value: number;
  className?: string;
  suffix?: string;
}

/** Skeleton: no count-up animation — static value. */
export function AnimatedCounter({ value, className, suffix = "" }: AnimatedCounterProps) {
  return (
    <span className={className}>
      {value}
      {suffix}
    </span>
  );
}
