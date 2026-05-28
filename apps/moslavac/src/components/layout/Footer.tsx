"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";

interface FooterProps {
  tenant: FrontendTenant;
}

export default function Footer({ tenant }: FooterProps) {
  const facebook = tenant.social?.facebook;
  const youtube = tenant.social?.youtube;
  const founded = tenant.branding?.founded;
  const motto = tenant.branding?.motto;
  const shortName = tenant.branding?.shortName;
  const email = tenant.contact?.email;
  const phone = tenant.contact?.phone;
  const address = tenant.contact?.address;
  const logo =
    tenant.branding?.logo && typeof tenant.branding.logo === "object"
      ? (tenant.branding.logo as PayloadMedia)
      : null;

  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Masthead row */}
        <FadeInView>
          <div className="flex items-center justify-between py-8">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label={tenant.displayName}
            >
              {logo?.url && (
                <Image
                  src={logo.url}
                  alt={logo.alt || tenant.displayName}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              )}
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                {shortName ?? tenant.displayName}
              </span>
            </Link>

            {(facebook || youtube) && (
              <div className="flex items-center gap-5 text-muted-foreground">
                {facebook && (
                  <a
                    href={facebook}
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    <FaFacebook className="size-[18px]" />
                  </a>
                )}
                {youtube && (
                  <a
                    href={youtube}
                    aria-label="YouTube"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    <FaYoutube className="size-[18px]" />
                  </a>
                )}
              </div>
            )}
          </div>
        </FadeInView>

        {/* Editorial columns */}
        <StaggerContainer
          className="grid grid-cols-1 border-t border-border/60 md:grid-cols-3"
          staggerChildren={0.1}
        >
          <StaggerItem className="space-y-5 py-10 md:border-r md:border-border/60 md:pr-10">
            <div className="flex items-baseline gap-3 text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground">
              <span className="text-foreground">01</span>
              <span>Kontakt</span>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed">
              {address && <li>{address}</li>}
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="transition-colors hover:text-muted-foreground"
                  >
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="transition-colors hover:text-muted-foreground"
                  >
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </StaggerItem>

          <StaggerItem className="space-y-5 border-t border-border/60 py-10 md:border-l-0 md:border-r md:border-t-0 md:border-border/60 md:px-10">
            <div className="flex items-baseline gap-3 text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground">
              <span className="text-foreground">02</span>
              <span>Klub</span>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li>
                <Link
                  href="/novosti"
                  className="transition-colors hover:text-muted-foreground"
                >
                  Vijesti
                </Link>
              </li>
              <li>
                <Link
                  href="/utakmice"
                  className="transition-colors hover:text-muted-foreground"
                >
                  Utakmice
                </Link>
              </li>
              <li>
                <Link
                  href="/prva-momcad"
                  className="transition-colors hover:text-muted-foreground"
                >
                  Momčad
                </Link>
              </li>
              <li>
                <Link
                  href="/sezonska-iskaznica"
                  className="transition-colors hover:text-muted-foreground"
                >
                  Sezonska ulaznica
                </Link>
              </li>
            </ul>
          </StaggerItem>

          <StaggerItem className="space-y-5 border-t border-border/60 py-10 md:border-t-0 md:pl-10">
            <div className="flex items-baseline gap-3 text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground">
              <span className="text-foreground">03</span>
              <span>Klub od 1933.</span>
            </div>
            <div className="space-y-3 text-sm leading-relaxed">
              {motto && (
                <p className="font-serif italic text-muted-foreground">
                  &ldquo;{motto}&rdquo;
                </p>
              )}
              {founded && (
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground">
                  {founded} — Popovača
                </p>
              )}
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom strip */}
        <FadeInView>
          <div className="flex flex-col gap-4 border-t border-border/60 py-6 text-[0.6rem] font-medium uppercase tracking-[0.35em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {tenant.displayName} — Sva prava
              pridržana
            </p>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/politika-privatnosti"
                className="transition-colors hover:text-foreground"
              >
                Politika privatnosti
              </Link>
              <Link
                href="/pravna-napomena"
                className="transition-colors hover:text-foreground"
              >
                Pravna napomena
              </Link>
              <p>
                Dizajn{" "}
                <span className="mx-1 text-foreground/40">/</span> Adriano
                Faletar
              </p>
            </nav>
          </div>
        </FadeInView>

      </div>
    </footer>
  );
}
