import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  NewsArchive,
  newsArchiveMetadata,
} from "@/components/features/news/NewsArchive";
import { parseNewsPageSegment } from "@/lib/newsPagination";

export const revalidate = 86400;

// Prazan popis: nijedna stranica se ne gradi pri buildu, ali se svaka prvim
// posjetom renderira statično i drži dan (ISR). Bez ovoga ruta je dinamična.
export async function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ n: string }>;
};

async function pageFrom(params: Props["params"]): Promise<number> {
  const page = parseNewsPageSegment((await params).n);
  if (page === null) notFound();
  if (page === 1) permanentRedirect("/novosti");
  return page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return newsArchiveMetadata(await pageFrom(params));
}

export default async function NewsListPage({ params }: Props) {
  return <NewsArchive page={await pageFrom(params)} />;
}
