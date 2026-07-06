"use client";

import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeInView, RevealHeading } from "@/components/animations";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { Equipment } from "@/types/equipment";

export default function WebShopView({ items }: { items: Equipment[] }) {
	return (
		<section className="mx-auto w-full max-w-7xl space-y-14 px-4 py-20 sm:py-28">
			<div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
				<div className="flex flex-col gap-3">
					<FadeInView delay={0.05}>
						<p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
							<span aria-hidden className="h-px w-8 bg-primary" />
							Službena oprema
						</p>
					</FadeInView>
					<RevealHeading
						lines={["Webshop"]}
						delay={0.1}
						className="select-none font-display font-black uppercase leading-[0.85] tracking-[-0.02em]"
						lineClassName="text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl"
					/>
				</div>
				<FadeInView delay={0.2}>
					<Link
						href="/oprema"
						className="group inline-flex items-center gap-3 pb-2 text-xs font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-primary"
					>
						Sva oprema
						<ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</FadeInView>
			</div>

			<FadeInView>
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
									<div className="relative aspect-square w-full overflow-hidden bg-secondary">
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
											<span className="h-0.5 w-8 bg-primary transition-all duration-300 group-hover:w-16" />
											<span className="font-display text-xl font-bold uppercase tracking-wide">
												{item.displayName}
											</span>
										</div>
										<span className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-primary">
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
			</FadeInView>
		</section>
	);
}
