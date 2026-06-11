"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
	FadeInView,
	ParallaxImage,
	RevealHeading,
} from "@/components/animations";

export default function SeasonTicketPromoSection() {
	return (
		<section className="w-full overflow-x-clip px-4 py-20 sm:py-28">
			<div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
				<FadeInView direction="left">
					<div className="relative">
						<ParallaxImage
							src="/fans.jpg"
							alt="SNK Moslavac navijači"
							sizes="(min-width: 768px) 50vw, 100vw"
							className="aspect-4/3 w-full md:aspect-square"
							imageClassName="grayscale"
						/>
						{/* Hollow number 12 anchors the "12th player" message */}
						<span
							aria-hidden
							className="pointer-events-none absolute -bottom-8 -right-2 select-none font-display text-9xl font-black leading-none text-stroke [--text-stroke-color:var(--club)] sm:-right-6 sm:text-[12rem]"
						>
							12
						</span>
					</div>
				</FadeInView>

				<FadeInView direction="right" delay={0.15}>
					<div className="flex flex-col items-start gap-8">
						<p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
							<span aria-hidden className="h-px w-8 bg-primary" />
							Sezonska iskaznica
						</p>

						<RevealHeading
							lines={["Postani naš", "12. igrač"]}
							className="select-none text-balance font-display font-black uppercase leading-[0.85]"
							lineClassName="text-[13vw] sm:text-7xl lg:text-8xl"
						/>

						<p className="max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
							Osiguraj svoje mjesto na tribinama i podržavaj svoj klub tijekom
							cijele sezone.
						</p>

						<Link
							href="/sezonska-iskaznica"
							className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-primary-foreground transition-colors duration-300 hover:bg-foreground sm:text-xs"
						>
							Kupi iskaznicu
							<ArrowRight
								className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
								strokeWidth={2.5}
							/>
						</Link>
					</div>
				</FadeInView>
			</div>
		</section>
	);
}
