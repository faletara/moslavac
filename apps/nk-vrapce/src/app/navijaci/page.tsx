import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { fetchPageByKey } from "@/lib/payload/getPages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageByKey({ key: "navijaci" });
  return {
    title: page?.title ?? "Lunatics Vrapče",
    description:
      page?.seoDescription ??
      "Navijačka skupina Lunatics Vrapče — naša boja, naš ponos. Srce tribina NK Vrapče.",
    alternates: { canonical: "/navijaci" },
  };
}

// Navijačke grafike koje je klub dostavio (public/lunatics).
const LUNATICS_HERO_BG =
  "/lunatics/713083130_824117730542476_7042454208515120744_n.jpg";

const LUNATICS_ART = [
  {
    src: "/lunatics/714443271_26680475911631257_7650010142066840067_n.jpg",
    alt: "Lunatics Vrapče — grafit",
  },
  {
    src: "/lunatics/712246382_1307582057645578_7311272543791100627_n.jpg",
    alt: "Lunatics 1993 Vrapče — Naša boja, naš ponos",
  },
  {
    src: "/lunatics/713003114_2379627475863298_4000292543681014022_n.jpg",
    alt: "Lunatics Vrapče",
  },
  {
    src: "/lunatics/714670292_1307019411560498_5514944001855140453_n.jpg",
    alt: "Lunatics Vrapče",
  },
  {
    src: LUNATICS_HERO_BG,
    alt: "Lunatics - Vrapče 1993",
  },
];

export default async function NavijaciPage() {
  const page = await fetchPageByKey({ key: "navijaci" });
  const heroBg = page?.heroImage?.sizes?.hero?.url ?? page?.heroImage?.url ?? LUNATICS_HERO_BG;
  const cmsGallery = page?.gallery ?? [];

  return (
    <div className="bg-brand-navy text-white">
      {/* Dark Lunatics hero */}
      <section className="relative isolate flex min-h-[70svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <Image
          src={heroBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-navy/70 via-brand-navy/60 to-brand-navy" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
          <span className="h-px w-12 bg-brand-yellow" />
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-brand-yellow sm:text-xs">
            {page?.eyebrow ?? "Navijačka skupina · 1993"}
          </p>
          <h1 className="text-balance text-5xl font-black uppercase leading-[1.04] tracking-tighter text-brand-yellow sm:text-7xl md:text-8xl">
            {page?.title ?? "Lunatics Vrapče"}
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-white/80 sm:text-base">
            Naša boja, naš ponos
          </p>
        </div>
      </section>

      {/* Optional CMS rich-text on a light surface for readability */}
      {page?.content && (
        <section className="bg-surface text-foreground">
          <div className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
            <article
              className="news-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>
      )}

      {/* Fan-art showcase — object-contain on dark cards (graphics, not photos) */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <span className="h-px w-12 bg-brand-yellow" />
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-yellow">
              Galerija navijača
            </h2>
          </div>
          <StaggerContainer
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6"
            staggerChildren={0.06}
          >
            {LUNATICS_ART.map((art) => (
              <StaggerItem key={art.src}>
                <FadeInView className="group relative aspect-square overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10 transition-shadow hover:ring-brand-yellow/40">
                  <Image
                    src={art.src}
                    alt={art.alt}
                    fill
                    sizes="(min-width: 640px) 30vw, 45vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                </FadeInView>
              </StaggerItem>
            ))}
            {cmsGallery.map((media) => (
              <StaggerItem key={media.id}>
                <FadeInView className="group relative aspect-square overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10 transition-shadow hover:ring-brand-yellow/40">
                  <Image
                    src={media.sizes?.card?.url ?? media.url}
                    alt={media.alt || "Lunatics Vrapče"}
                    fill
                    sizes="(min-width: 640px) 30vw, 45vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                  />
                </FadeInView>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
