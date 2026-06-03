"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
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
    <footer className="mt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Masthead row */}
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
              />
            )}
            <span>
              {shortName ?? tenant.displayName}
            </span>
          </Link>

          {(facebook || youtube) && (
            <div className="flex items-center gap-5">
              {facebook && (
                <a
                  href={facebook}
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
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
                >
                  <FaYoutube className="size-[18px]" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Editorial columns */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="space-y-5 py-10 md:pr-10">
            <div className="flex items-baseline gap-3">
              <span>01</span>
              <span>Kontakt</span>
            </div>
            <ul className="space-y-2">
              {address && <li>{address}</li>}
              {email && (
                <li>
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone}`}>
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-5 py-10 md:px-10">
            <div className="flex items-baseline gap-3">
              <span>02</span>
              <span>Klub</span>
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/novosti">
                  Vijesti
                </Link>
              </li>
              <li>
                <Link href="/utakmice">
                  Utakmice
                </Link>
              </li>
              <li>
                <Link href="/prva-momcad">
                  Momčad
                </Link>
              </li>
              <li>
                <Link href="/sezonska-iskaznica">
                  Sezonska ulaznica
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5 py-10 md:pl-10">
            <div className="flex items-baseline gap-3">
              <span>03</span>
              <span>Klub od 1933.</span>
            </div>
            <div className="space-y-3">
              {motto && (
                <p>
                  &ldquo;{motto}&rdquo;
                </p>
              )}
              {founded && (
                <p>
                  {founded} — Popovača
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {tenant.displayName} — Sva prava
            pridržana
          </p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/politika-privatnosti">
              Politika privatnosti
            </Link>
            <Link href="/pravna-napomena">
              Pravna napomena
            </Link>
            <p>
              Dizajn{" "}
              <span className="mx-1">/</span> Adriano
              Faletar
            </p>
          </nav>
        </div>
      </div>
    </footer>
  );
}
