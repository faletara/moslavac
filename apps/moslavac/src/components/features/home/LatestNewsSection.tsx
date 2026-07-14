import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
	FadeInView,
	ParallaxImage,
	RevealHeading,
	StaggerContainer,
	StaggerItem,
} from "@/components/animations";
import { formatDateLong } from "@/lib/helpers/date";
import { fetchLatestNews } from "@/lib/payload/getNews";
import { getTenant } from "@/lib/payload/getTenant";
import type { News } from "@/types/news";

function SectionHeader() {
	return (
		<div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
			<div className="flex flex-col gap-3">
				<RevealHeading
					lines={["Vijesti"]}
					delay={0.1}
					className="select-none font-display font-black uppercase leading-[0.85] tracking-[-0.02em]"
					lineClassName="text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl"
				/>
			</div>
			<FadeInView delay={0.2}>
				<Link
					href="/novosti"
					className="group hidden items-center gap-3 pb-2 text-xs font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-primary sm:inline-flex"
				>
					Sve vijesti
					<ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
				</Link>
			</FadeInView>
		</div>
	);
}

function NewsCard({
	item,
	fallback,
}: {
	item: News;
	fallback: string;
}) {
	return (
		<Link
			href={`/novosti/${item.slug ?? item.id}`}
			className="group flex flex-col"
		>
			<div className="relative overflow-hidden">
				<ParallaxImage
					src={item.thumbnailPath || fallback}
					alt={item.title}
					sizes="(min-width: 768px) 33vw, 100vw"
					className="aspect-4/3 w-full"
					strength={5}
					imageClassName={`transition-transform duration-700 ease-out group-hover:scale-[1.05] ${
						item.thumbnailPath
							? "object-cover"
							: "object-contain p-10 opacity-60"
					}`}
				/>
				<ArrowUpRight className="absolute right-3 top-3 size-5 translate-y-1 text-chalk opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
				{/* Accent rule that grows on hover */}
				<span
					aria-hidden
					className="absolute bottom-0 left-0 h-1 w-12 bg-primary transition-all duration-500 ease-out group-hover:w-full"
				/>
			</div>

			<div className="mt-6 flex flex-1 flex-col gap-3">
				<p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
					{formatDateLong(item.date)}
				</p>

				<h3 className="line-clamp-3 text-balance font-display text-xl font-black uppercase leading-[1.05] transition-colors duration-300 group-hover:text-primary sm:text-2xl">
					{item.title}
				</h3>
			</div>
		</Link>
	);
}

export default async function LatestNewsSection() {
	const [news, tenant] = await Promise.all([fetchLatestNews(), getTenant()]);
	const logo =
		tenant.branding?.logo &&
		typeof tenant.branding.logo === "object" &&
		"url" in tenant.branding.logo
			? tenant.branding.logo
			: null;
	const fallback = logo?.url ?? "";

	if (!news || news.length === 0) return null;

	const items = news.slice(0, 3);

	return (
		<section className="mx-auto w-full max-w-7xl space-y-14 px-4 py-20 sm:py-28">
			<SectionHeader />

			<StaggerContainer
				className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8"
				staggerChildren={0.12}
			>
				{items.map((item) => (
					<StaggerItem key={item.id}>
						<NewsCard item={item} fallback={fallback} />
					</StaggerItem>
				))}
			</StaggerContainer>

			<FadeInView delay={0.1}>
				<Link
					href="/novosti"
					className="group flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-primary sm:hidden"
				>
					Sve vijesti
					<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
				</Link>
			</FadeInView>
		</section>
	);
}
