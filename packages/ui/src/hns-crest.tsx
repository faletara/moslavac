import Image from "next/image";
import { getCometImageUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

interface HnsCrestProps {
  picture: string | null | undefined;
  name: string | null | undefined;
  size: number;
  className?: string;
}

function fallbackInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

export function HnsCrest({ picture, name, size, className }: HnsCrestProps) {
  const alt = name ?? "";
  const dimension = { width: size, height: size };

  if (!picture) {
    return (
      <span
        style={dimension}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold uppercase text-muted-foreground",
          className,
        )}
        aria-label={alt}
      >
        {fallbackInitials(name)}
      </span>
    );
  }

  return (
    <Image
      src={getCometImageUrl(picture, { transparent: true })}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
