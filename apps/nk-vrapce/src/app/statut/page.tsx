import { Download, FileText } from "lucide-react";
import type { Metadata } from "next";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/animations";
import { PageHero } from "@/components/features/PageHero";
import { fetchDocuments } from "@/lib/payload/getDocuments";
import { fetchPageByKey } from "@/lib/payload/getPages";
import type { ClubDocument, DocumentCategory } from "@/types/document";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageByKey({ key: "statut" });
  return {
    title: page?.title ?? "Statut kluba",
    description:
      page?.seoDescription ??
      "Statut i službeni dokumenti NK Vrapče dostupni za preuzimanje.",
    alternates: { canonical: "/statut" },
  };
}

const categoryOrder: DocumentCategory[] = [
  "statut",
  "pravilnik",
  "obrazac",
  "izvjesce",
  "ostalo",
];

const categoryLabels: Record<DocumentCategory, string> = {
  statut: "Statut",
  pravilnik: "Pravilnici",
  obrazac: "Obrasci",
  izvjesce: "Izvješća",
  ostalo: "Ostali dokumenti",
};

export default async function StatutPage() {
  const [page, documents] = await Promise.all([
    fetchPageByKey({ key: "statut" }),
    fetchDocuments(),
  ]);

  const grouped = categoryOrder
    .map((category) => ({
      category,
      docs: documents
        .filter((d) => d.category === category)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }))
    .filter((section) => section.docs.length > 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <PageHero
        eyebrow="Pravni okvir"
        title={page?.title ?? "Statut kluba"}
        description={
          page?.content
            ? undefined
            : "Službeni dokumenti kluba dostupni za preuzimanje."
        }
      />

      {page?.content && (
        <article
          className="news-content mx-auto mt-12 max-w-2xl sm:mt-16"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}

      {grouped.length === 0 ? (
        <p className="mt-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Dokumenti uskoro.
        </p>
      ) : (
        <div className="mt-16 space-y-12 sm:mt-20">
          {grouped.map((section) => (
            <section key={section.category} className="space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
                {categoryLabels[section.category]}
              </h2>
              <StaggerContainer className="space-y-3" staggerChildren={0.05}>
                {section.docs.map((doc) => (
                  <StaggerItem key={doc.id}>
                    <DocumentRow doc={doc} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentRow({ doc }: { doc: ClubDocument }) {
  if (!doc.url) return null;
  return (
    <FadeInView>
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-lg border border-border/70 bg-surface px-5 py-4 transition-colors hover:border-brand-yellow hover:bg-accent"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-navy text-brand-yellow">
          <FileText className="size-5" />
        </span>
        <span className="flex-1 text-sm font-semibold uppercase tracking-tight">
          {doc.title}
        </span>
        <Download className="size-4 text-muted-foreground transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-brand-blue" />
      </a>
    </FadeInView>
  );
}
