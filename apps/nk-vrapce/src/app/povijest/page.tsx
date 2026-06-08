import type { Metadata } from "next";
import { RichTextPage } from "@/components/features/RichTextPage";
import { fetchPageByKey } from "@/lib/payload/getPages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageByKey({ key: "povijest" });
  return {
    title: page?.title ?? "Povijest kluba",
    description:
      page?.seoDescription ??
      "Povijest nogometnog kluba NK Vrapče — od osnutka do danas.",
    alternates: { canonical: "/povijest" },
  };
}

export default async function PovijestPage() {
  const page = await fetchPageByKey({ key: "povijest" });
  return (
    <RichTextPage
      page={page}
      fallbackEyebrow="Naša priča"
      fallbackTitle="Povijest kluba"
      fallbackDescription="Od osnutka 1932. do danas — priča o nogometnom klubu NK Vrapče."
      emptyMessage="Povijest kluba uskoro će biti objavljena."
    />
  );
}
