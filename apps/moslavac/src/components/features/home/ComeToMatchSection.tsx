"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
	FadeInView,
	ParallaxImage,
	RevealHeading,
} from "@/components/animations";

export default function ComeToMatchSection() {
	return (
		<section className="dark relative isolate w-full overflow-hidden bg-navy-deep text-foreground">
			<ParallaxImage
				src="/game.jpg"
				alt="SNK Moslavac utakmica"
				sizes="100vw"
				className="absolute inset-0 -z-20"
				imageClassName="grayscale opacity-70"
				strength={10}
			/>
			{/* Club-blue duotone over the grayscale shot */}
			<div className="absolute inset-0 -z-10 bg-club/30 mix-blend-color" />
			<div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-deep/95 via-navy-deep/70 to-navy-deep/30" />

			<div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-28 sm:py-40 md:px-6">
				<FadeInView direction="up">
					<p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-foreground/70 sm:text-xs sm:tracking-[0.4em]">
						<span aria-hidden className="h-px w-8 bg-primary" />
						Podrži svoj klub
					</p>
				</FadeInView>

				<RevealHeading
					lines={["Dođi na", "utakmicu"]}
					delay={0.1}
					className="select-none text-balance font-display font-black uppercase leading-[0.85]"
					lineClassName="text-[17vw] sm:text-8xl md:text-9xl lg:text-[10rem]"
				/>

				<FadeInView direction="up" delay={0.2}>
					<p className="max-w-md text-balance text-sm leading-relaxed text-foreground/70 sm:text-base">
						Atmosfera, navijači i naša momčad — uživo na stadionu. Vidimo se na
						tribinama.
					</p>
				</FadeInView>

				<FadeInView direction="up" delay={0.3}>
					<Link
						href="/utakmice"
						className="group mt-2 inline-flex items-center gap-3 rounded-full bg-chalk px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-navy-deep transition-colors duration-300 hover:bg-club hover:text-chalk sm:text-xs"
					>
						Pogledaj raspored
						<ArrowRight
							className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
							strokeWidth={2.5}
						/>
					</Link>
				</FadeInView>
			</div>
		</section>
	);
}
