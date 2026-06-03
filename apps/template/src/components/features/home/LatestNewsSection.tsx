"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTenantLogo } from "@/components/providers/TenantProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatDateLong } from "@/lib/helpers/date";

const SKELETON_KEYS = ["n1", "n2", "n3"];

function SectionHeader() {
	return (
		<div className="flex flex-col items-center gap-6">
			<p>Najnovije</p>
			<h2>Vijesti</h2>
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

	const items = news.slice(0, 3);

	return (
		<section className="mx-auto w-full max-w-7xl space-y-16 px-4 py-8 sm:py-12">
			<SectionHeader />

			<div className="grid gap-14 md:grid-cols-3 md:gap-10">
				{items.map((item) => (
					<div key={item.id}>
						<Link
							href={`/novosti/${item.slug ?? item.id}`}
							className="flex flex-col gap-6"
						>
							<div className="relative aspect-4/3 w-full overflow-hidden">
								<Image
									src={item.thumbnailPath || fallback}
									alt={item.title}
									fill
									sizes="(min-width: 768px) 33vw, 100vw"
									className={
										item.thumbnailPath
											? "object-cover"
											: "object-contain p-10"
									}
								/>
							</div>

							<div className="flex flex-col gap-4">
								<div className="flex items-center gap-3">
									<p>{formatDateLong(item.date)}</p>
								</div>

								<h3 className="line-clamp-3">{item.title}</h3>
							</div>
						</Link>
					</div>
				))}
			</div>

			<div className="flex justify-center pt-4">
				<Link href="/novosti" className="inline-flex items-center gap-3">
					Sve vijesti
					<ArrowRight className="size-3" />
				</Link>
			</div>
		</section>
	);
}
