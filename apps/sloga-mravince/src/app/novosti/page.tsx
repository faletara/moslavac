import type { Metadata } from "next";
import {
  NewsArchive,
  newsArchiveMetadata,
} from "@/components/features/news/NewsArchive";

export const revalidate = 86400;

export function generateMetadata(): Promise<Metadata> {
  return newsArchiveMetadata(1);
}

export default function NewsPage() {
  return <NewsArchive page={1} />;
}
