import Image from "next/image";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  strength?: number;
}

/** Skeleton: no parallax — plain image in a frame. */
export function ParallaxImage({
  src,
  alt,
  sizes = "100vw",
  priority,
  className,
  imageClassName,
}: ParallaxImageProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
