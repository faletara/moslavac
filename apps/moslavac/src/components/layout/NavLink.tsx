"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function NavLink({
  href,
  children,
  className,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isExternal = href.startsWith("http");
  const isActive =
    !isExternal && (pathname === href || pathname.startsWith(`${href}/`));

  const base =
    "inline-flex items-center text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-foreground";
  const state = isActive ? "text-foreground" : "text-muted-foreground";

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(base, "text-muted-foreground", className)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(base, state, className)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
