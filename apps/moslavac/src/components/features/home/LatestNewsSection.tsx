"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
	FadeInView,
	ParallaxImage,
	RevealHeading,
	StaggerContainer,
	StaggerItem,
} from "@/components/animations";
import { useTenantLogo } from "@/components/providers/TenantProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatDateLong } from "@/lib/helpers/date";
import type { News } from "@/types/news";

const SKELETON_KEYS = ["n1", "n2", "n3"];

function SectionHeader() {
	return (
		<div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
			<div className="flex flex-col gap-3">
				<FadeInView delay={0.05}>
					<p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
						<span aria-hidden className="h-px w-8 bg-primary" />
						Najnovije iz kluba
					</p>
				</FadeInView>
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
					className="group inline-flex items-center gap-3 pb-2 text-xs font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-primary"
				>
					Sve vijesti
					<ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
				</Link>
			</FadeInView>
		</div>
	);
}

function FeatureCard({ item, fallback }: { item: News; fallback: string }) {
	return (
		<Link
			href={`/novosti/${item.slug ?? item.id}`}
			className="group flex flex-col gap-7"
		>
			<div className="relative">
				<ParallaxImage
					src={item.thumbnailPath || fallback}
					alt={item.title}
					sizes="(min-width: 768px) 58vw, 100vw"
					className="aspect-[16/10] w-full"
					strength={6}
					imageClassName={`transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
						item.thumbnailPath
							? "object-cover"
							: "object-contain p-10 opacity-60"
					}`}
				/>
				<span
					aria-hidden
					className="absolute left-0 top-0 select-none bg-background px-4 py-2 font-display text-2xl font-black leading-none text-primary sm:text-3xl"
				>
					01
				</span>
			</div>

			<div className="flex flex-col gap-4">
				<p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
					{formatDateLong(item.date)}
				</p>
				<h3 className="line-clamp-3 max-w-2xl text-balance font-display text-3xl font-black uppercase leading-[0.95] transition-colors duration-300 group-hover:text-primary sm:text-4xl md:text-5xl">
					{item.title}
				</h3>
			</div>
		</Link>
	);
}

function SideCard({
	item,
	index,
	fallback,
}: {
	item: News;
	index: number;
	fallback: string;
}) {
	return (
		<Link
			href={`/novosti/${item.slug ?? item.id}`}
			className="group flex flex-1 flex-col gap-5 border-t border-border pt-6 first:border-t-0 first:pt-0 md:first:border-t md:first:pt-6"
		>
			<div className="flex items-start justify-between gap-4">
				<span
					aria-hidden
					className="select-none font-display text-2xl font-black leading-none text-stroke-thin [--text-stroke-color:color-mix(in_oklab,var(--foreground)_35%,transparent)] sm:text-3xl"
				>
					{String(index + 2).padStart(2, "0")}
				</span>
				<ArrowUpRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
			</div>

			<div className="flex gap-5">
				<ParallaxImage
					src={item.thumbnailPath || fallback}
					alt={item.title}
					sizes="160px"
					className="aspect-square w-24 shrink-0 sm:w-28"
					strength={4}
					imageClassName={`transition-transform duration-700 ease-out group-hover:scale-[1.06] ${
						item.thumbnailPath
							? "object-cover"
							: "object-contain p-4 opacity-60"
					}`}
				/>
				<div className="flex min-w-0 flex-col gap-3">
					<p className="text-[0.55rem] font-bold uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem]">
						{formatDateLong(item.date)}
					</p>
					<h3 className="line-clamp-3 text-balance font-display text-xl font-black uppercase leading-[0.95] transition-colors duration-300 group-hover:text-primary sm:text-2xl">
						{item.title}
					</h3>
				</div>
			</div>
		</Link>
	);
}

export default function LatestNewsSection() {
	const { data: news, isLoading } = api.news.useGetLatestNews();
	const logo = useTenantLogo();
	const fallback = logo?.url ?? "";

	if (isLoading) {
		return (
			<section className="mx-auto w-full max-w-7xl space-y-14 px-4 py-20 sm:py-28">
				<SectionHeader />
				<div className="grid gap-12 md:grid-cols-3 md:gap-10">
					{SKELETON_KEYS.map((key) => (
						<div key={key} className="flex flex-col gap-6">
							<Skeleton className="aspect-4/3 w-full" />
							<Skeleton className="h-3 w-32" />
							<Skeleton className="h-7 w-3/4" />
							<Skeleton className="h-7 w-1/2" />
						</div>
					))}
				</div>
			</section>
		);
	}

	if (!news || news.length === 0) return null;

	const [feature, ...side] = news.slice(0, 3);

	return (
		<section className="mx-auto w-full max-w-7xl space-y-14 px-4 py-20 sm:py-28">
			<SectionHeader />

			<StaggerContainer
				className="grid gap-12 md:grid-cols-12 md:gap-10 lg:gap-14"
				staggerChildren={0.12}
			>
				<StaggerItem className="md:col-span-7">
					{feature && <FeatureCard item={feature} fallback={fallback} />}
				</StaggerItem>
				<StaggerItem className="md:col-span-5">
					<div className="flex h-full flex-col gap-8 md:justify-between">
						{side.map((item, i) => (
							<SideCard
								key={item.id}
								item={item}
								index={i}
								fallback={fallback}
							/>
						))}
					</div>
				</StaggerItem>
			</StaggerContainer>
		</section>
	);
}
