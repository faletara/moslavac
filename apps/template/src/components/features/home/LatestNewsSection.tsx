"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTenantLogo } from "@/components/providers/TenantProvider";
import { api } from "@/lib/api";
import { formatDateLong } from "@/lib/helpers/date";

const SKELETON_KEYS = ["n1", "n2", "n3"];

function SectionHeader() {
	return (
		<div className="flex flex-col items-center gap-6 text-center">
			<span className="h-px w-12 bg-foreground" />
			<p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
				Najnovije
			</p>
			<h2 className="select-none text-balance font-black uppercase leading-[0.85] tracking-tighter">
				<span className="block text-[14vw] sm:text-6xl md:text-7xl lg:text-8xl">
					Vijesti
				</span>
			</h2>
		</div>
	);
}

export default function LatestNewsSection() {
	const { data: news, isLoading } = api.news.useGetLatestNews();
	const logo = useTenantLogo();
	const fallback = logo?.url ?? "";

	if (isLoading) {
		return (
			<section className="mx-auto w-full max-w-7xl space-y-16 px-4">
				<SectionHeader />
				<div className="grid gap-12 md:grid-cols-3 md:gap-10">
					{SKELETON_KEYS.map((key) => (
						<div key={key} className="flex flex-col gap-6">
							<Skeleton className="aspect-[4/3] w-full" />
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

	const items = news.slice(0, 3);

	return (
		<section className="mx-auto w-full max-w-7xl space-y-16 px-4 py-8 sm:py-12">
			<SectionHeader />

			<div className="grid gap-14 md:grid-cols-3 md:gap-10">
				{items.map((item) => (
					<Link
						key={item.id}
						href={`/news/${item.id}`}
						className="group flex flex-col gap-6"
					>
						<div className="relative aspect-[4/3] w-full overflow-hidden">
							<img
								src={item.thumbnailPath || fallback}
								alt={item.title}
								className={`size-full transition-transform duration-700 ease-out group-hover:scale-[1.03] ${
									item.thumbnailPath
										? "object-cover"
										: "object-contain p-10 opacity-60"
								}`}
							/>
						</div>

						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<span className="h-px w-8 bg-foreground transition-all duration-300 group-hover:w-16" />
								<p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
									{formatDateLong(item.date)}
								</p>
							</div>

							<h3 className="line-clamp-3 text-balance text-2xl font-black uppercase leading-[0.95] tracking-tighter md:text-3xl">
								{item.title}
							</h3>
						</div>
					</Link>
				))}
			</div>

			<div className="flex justify-center pt-4">
				<Link
					href="/news"
					className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground"
				>
					Sve vijesti
					<ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
				</Link>
			</div>
		</section>
	);
}
