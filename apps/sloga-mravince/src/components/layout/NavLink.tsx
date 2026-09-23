"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  label: string;
  href?: string;
  /** Vodi izvan stranice — renderira se kao <a> u novoj kartici. */
  external?: boolean;
  className?: string;
}

/**
 * Stavka glavne navigacije u ink headeru. Crveni underline raste na hover, a na
 * aktivnoj ruti stoji izvučen — tako se s trake vidi na kojoj je stranici
 * posjetitelj, bez pomicanja miša.
 *
 * Aktivnom se smatra i podstranica (`/novosti/neka-vijest` osvjetljava
 * „Novosti”). Vanjski linkovi (webshop) nikad nisu aktivni.
 */
export default function NavLink({
  label,
  href,
  external = false,
  className,
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive =
    !external &&
    href != null &&
    href.startsWith("/") &&
    (pathname === href || pathname.startsWith(`${href}/`));

  const base = cn(
    "group relative pb-1 text-[0.72rem] font-bold uppercase tracking-[0.22em] transition-colors",
    isActive ? "text-chalk" : "text-chalk/80 hover:text-chalk",
    className,
  );

  const underline = (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left bg-club-red transition-transform duration-300 ease-out",
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
      )}
    />
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
        {label}
        <span className="sr-only">(otvara se u novoj kartici)</span>
        {underline}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={base}
      >
        {label}
        {underline}
      </Link>
    );
  }

  return (
    <span className={cn(base, "cursor-default")}>
      {label}
      {underline}
    </span>
  );
}
