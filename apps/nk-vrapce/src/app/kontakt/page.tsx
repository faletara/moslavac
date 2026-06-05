import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import type { IconType } from "react-icons";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { FadeInView } from "@/components/animations";
import { BrandedHero, type HeroStat } from "@/components/features/BrandedHero";
import { getTenant } from "@/lib/payload/getTenant";

export const metadata: Metadata = {
  title: "Lokacija i kontakt",
  description:
    "Kontakt podaci, lokacija i službeni podaci nogometnog kluba NK Vrapče.",
  alternates: { canonical: "/kontakt" },
};

export default async function KontaktPage() {
  const tenant = await getTenant();
  const contact = tenant.contact;
  const social = tenant.social;
  const legal = tenant.legal;
  const founded = tenant.branding?.founded;

  const socialLinks = [
    social?.facebook && {
      href: social.facebook,
      label: "Facebook",
      Icon: FaFacebook,
    },
    social?.youtube && {
      href: social.youtube,
      label: "YouTube",
      Icon: FaYoutube,
    },
  ].filter(Boolean) as { href: string; label: string; Icon: IconType }[];

  const clubData = [
    { label: "Puni naziv", value: tenant.displayName },
    founded ? { label: "Godina osnutka", value: String(founded) } : null,
    legal?.oib ? { label: "OIB", value: legal.oib } : null,
    legal?.registryNumber
      ? { label: "Registarski broj", value: legal.registryNumber }
      : null,
    legal?.registryAuthority
      ? { label: "Tijelo upisa", value: legal.registryAuthority }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const stats: HeroStat[] = founded
    ? [{ value: String(founded), label: "Osnovan" }]
    : [];

  return (
    <>
      <BrandedHero
        eyebrow="Tu smo za vas"
        title="Lokacija i kontakt"
        description="Posjetite nas ili nam se javite — uvijek nam je drago čuti navijače i partnere."
        stats={stats}
      />

      <div className="mx-auto w-full max-w-screen-xl px-6 pb-24 lg:px-8">
        <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-2 lg:gap-16">
        <FadeInView className="space-y-8">
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Kontakt
            </h2>
            <ul className="space-y-4 text-sm">
              {contact?.address && (
                <ContactItem Icon={MapPin}>
                  <span className="whitespace-pre-line">{contact.address}</span>
                </ContactItem>
              )}
              {contact?.phone && (
                <ContactItem Icon={Phone}>
                  <a
                    href={`tel:${contact.phone}`}
                    className="transition-colors hover:text-brand-blue"
                  >
                    {contact.phone}
                  </a>
                </ContactItem>
              )}
              {contact?.email && (
                <ContactItem Icon={Mail}>
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors hover:text-brand-blue"
                  >
                    {contact.email}
                  </a>
                </ContactItem>
              )}
            </ul>
          </div>

          {socialLinks.length > 0 && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Pratite nas
              </h2>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-brand-yellow hover:bg-accent"
                  >
                    <Icon className="size-4 text-brand-blue" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {clubData.length > 0 && (
            <div className="space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Podaci kluba
              </h2>
              <dl className="divide-y divide-border/60 border-y border-border/60">
                {clubData.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-6 py-3"
                  >
                    <dt className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-right text-sm font-semibold">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </FadeInView>

        <FadeInView delay={0.1}>
          {contact?.mapEmbedUrl ? (
            <div className="h-full min-h-80 overflow-hidden rounded-xl border border-border/70">
              <iframe
                title="Lokacija NK Vrapče"
                src={contact.mapEmbedUrl}
                className="h-full min-h-80 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center rounded-xl bg-surface-2 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Karta lokacije uskoro.
            </div>
          )}
        </FadeInView>
        </div>
      </div>
    </>
  );
}

function ContactItem({
  Icon,
  children,
}: {
  Icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-brand-yellow" />
      <span className="text-foreground">{children}</span>
    </li>
  );
}
