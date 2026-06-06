import type { Metadata } from "next";
import Image from "next/image";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero } from "@/components/features/BrandedHero";
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
  const heroBg =
    page?.heroImage?.sizes?.hero?.url ??
    page?.heroImage?.url ??
    LUNATICS_HERO_BG;
  const cmsGallery = page?.gallery ?? [];

  // Galerija je CMS-driven; dok klub ne uploada slike, koristi se dostavljena grafika.
  const galleryItems =
    cmsGallery.length > 0
      ? cmsGallery.map((media) => ({
          src: media.sizes?.card?.url ?? media.url,
          alt: media.alt || "Lunatics Vrapče",
        }))
      : LUNATICS_ART;

  return (
    <>
      <BrandedHero
        eyebrow={page?.eyebrow ?? "Navijačka skupina · 1993"}
        title={page?.title ?? "Lunatics Vrapče"}
        description="Naša boja, naš ponos — srce tribina NK Vrapče."
        stats={[{ value: "1993", label: "Osnovani" }]}
        backgroundImage={heroBg}
      />

      {/* Opcionalni CMS rich-text */}
      {page?.content && (
        <section className="mx-auto w-full max-w-2xl px-6 py-16 sm:py-20">
          <article
            className="news-content"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </section>
      )}

      {/* Galerija navijača — object-contain na tamnim karticama (grafike) */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12 flex flex-col items-center gap-4 text-center">
            <span className="h-[3px] w-10 rounded-full bg-brand-yellow" />
            <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
              Galerija navijača
            </h2>
          </div>
          <StaggerContainer
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6"
            staggerChildren={0.06}
          >
            {galleryItems.map((art) => (
              <StaggerItem key={art.src}>
                <FadeInView className="group relative aspect-square overflow-hidden bg-black/40 ring-1 ring-white/10 transition-shadow hover:ring-brand-yellow/40">
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
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
