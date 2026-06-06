"use client";

import { Children, useEffect, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface CardSliderProps {
	children: React.ReactNode;
	/** Responzivna širina svake kartice — npr. "basis-[80%] sm:basis-1/3". */
	itemClassName?: string;
	/** "dark" = na navy sekciji (svijetli gumbi), "light" = na bijeloj. */
	tone?: "light" | "dark";
}

/**
 * Embla carousel sa strelicama ISPOD trake, centrirano. Strelice se prikazuju
 * samo kad ima što za scrollati (na desktopu gdje sve stane → izgleda kao grid).
 * Prva kartica je poravnata s lijevim rubom sekcije (align: "start").
 */
export function CardSlider({
	children,
	itemClassName,
	tone = "light",
}: CardSliderProps) {
	const [api, setApi] = useState<CarouselApi>();
	const [canScroll, setCanScroll] = useState(false);

	useEffect(() => {
		if (!api) return;
		const update = () =>
			setCanScroll(api.canScrollPrev() || api.canScrollNext());
		update();
		api.on("reInit", update);
		api.on("select", update);
		return () => {
			api.off("reInit", update);
			api.off("select", update);
		};
	}, [api]);

	const btn =
		tone === "dark"
			? "border-white/30 bg-transparent text-white hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-navy"
			: "border-brand-navy/20 bg-transparent text-brand-navy hover:border-brand-navy hover:bg-brand-navy hover:text-white";

	return (
		<Carousel setApi={setApi} opts={{ align: "start" }}>
			<CarouselContent className="-ml-5">
				{Children.map(children, (child) => (
					<CarouselItem className={cn("pl-5", itemClassName)}>
						{child}
					</CarouselItem>
				))}
			</CarouselContent>

			{canScroll && (
				<div className="mt-8 flex justify-center gap-3">
					<CarouselPrevious
						className={cn(
							"static size-11 translate-x-0 translate-y-0 rounded-none",
							btn,
						)}
					/>
					<CarouselNext
						className={cn(
							"static size-11 translate-x-0 translate-y-0 rounded-none",
							btn,
						)}
					/>
				</div>
			)}
		</Carousel>
	);
}
