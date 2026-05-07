"use client";

import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedLine, FadeInView } from "@/components/animations";
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
		<FadeInView>
			<section className="mx-auto w-full max-w-6xl space-y-14 px-6 sm:px-10">
				<div className="flex flex-col items-center gap-5 text-center">
					<AnimatedLine className="mx-auto" />
					<FadeInView delay={0.05}>
						<p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
							Službena oprema
						</p>
					</FadeInView>
					<FadeInView delay={0.1}>
						<h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tighter sm:text-5xl md:text-6xl">
							Webshop
						</h2>
					</FadeInView>
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
									<motion.a
										href={item.externalUrl}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={`Kupi ${item.displayName}`}
										className="group flex flex-col gap-5"
										whileHover={{ y: -4 }}
										transition={{ duration: 0.2 }}
									>
										<div className="relative aspect-square w-full overflow-hidden bg-muted">
											{item.imagePath && (
												<Image
													src={item.imagePath}
													alt={item.imageAlt}
													fill
													sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
													className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
												/>
											)}
										</div>

										<div className="flex items-end justify-between gap-4">
											<div className="flex flex-col gap-3">
												<span className="h-px w-8 bg-foreground transition-all duration-300 group-hover:w-16" />
												<span className="text-sm font-semibold uppercase tracking-[0.2em]">
													{item.displayName}
												</span>
											</div>
											<span className="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-foreground">
												Kupi
												<ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
											</span>
										</div>
									</motion.a>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="hidden border-0 bg-transparent shadow-none hover:bg-transparent sm:flex" />
						<CarouselNext className="hidden border-0 bg-transparent shadow-none hover:bg-transparent sm:flex" />
					</Carousel>
				)}

				<div className="flex justify-center">
					<Link
						href="/oprema"
						className="group inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
					>
						Pogledaj svu opremu
						<ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</Link>
				</div>
			</section>
		</FadeInView>
	);
}
