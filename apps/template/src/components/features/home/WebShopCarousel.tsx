"use client";

import Autoplay from "embla-carousel-autoplay";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

const skeletonKeys = ["sk1", "sk2", "sk3"];

export default function WebShopCarousel() {
	const { data: items = [], isLoading } = api.equipment.useGetFeaturedEquipment();

	if (!isLoading && items.length === 0) return null;

	return (
		<section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
			<div className="flex flex-col items-center gap-5">
				<p>Službena oprema</p>
				<h2>Webshop</h2>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{skeletonKeys.map((k) => (
						<Skeleton key={k} className="aspect-square w-full" />
					))}
				</div>
			) : (
				<Carousel
					plugins={[Autoplay({ delay: 5000 })]}
					opts={{ loop: true, align: "start" }}
					className="w-full"
				>
					<CarouselContent className="-ml-6">
						{items.map((item) => (
							<CarouselItem
								key={item.id}
								className="basis-full pl-6 sm:basis-1/2 lg:basis-1/3"
							>
								<a
									href={item.externalUrl}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Kupi ${item.displayName}`}
									className="flex flex-col gap-5"
								>
									<div className="relative aspect-square w-full overflow-hidden">
										{item.imagePath && (
											<Image
												src={item.imagePath}
												alt={item.imageAlt}
												fill
												sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
												className="object-cover"
											/>
										)}
									</div>

									<div className="flex items-end justify-between gap-4">
										<div className="flex flex-col gap-3">
											<span>{item.displayName}</span>
										</div>
										<span className="flex items-center gap-1.5">
											Kupi
											<ArrowUpRight className="size-3" />
										</span>
									</div>
								</a>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="hidden sm:flex" />
					<CarouselNext className="hidden sm:flex" />
				</Carousel>
			)}

			<div className="flex justify-center">
				<Link
					href="/oprema"
					className="inline-flex items-center gap-2"
				>
					Pogledaj svu opremu
					<ArrowUpRight className="size-3" />
				</Link>
			</div>
		</section>
	);
}
