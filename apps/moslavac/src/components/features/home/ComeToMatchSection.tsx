"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
	AnimatedLine,
	FadeInView,
	ParallaxImage,
	RevealHeading,
} from "@/components/animations";

export default function ComeToMatchSection() {
	return (
		<section className="relative isolate w-full overflow-hidden">
			<ParallaxImage
				src="/game.jpg"
				alt="SNK Moslavac utakmica"
				sizes="100vw"
				className="absolute inset-0 -z-20"
				imageClassName="grayscale"
				strength={10}
			/>
			<div className="absolute inset-0 -z-10 bg-black/65" />

			<div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-24 sm:py-32 md:px-6">
				<FadeInView direction="up">
					<div className="flex flex-col items-start gap-4">
						<AnimatedLine />
						<p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-white/70 sm:text-xs sm:tracking-[0.4em]">
							Podrži svoj klub
						</p>
					</div>
				</FadeInView>

				<RevealHeading
					lines={["Dođi na", "utakmicu"]}
					delay={0.1}
					className="select-none text-balance font-black uppercase leading-none tracking-tighter text-white"
					lineClassName="text-[14vw] sm:text-6xl md:text-7xl lg:text-8xl"
				/>

				<FadeInView direction="up" delay={0.2}>
					<p className="max-w-md text-balance text-sm leading-relaxed text-white/70 sm:text-base">
						Atmosfera, navijači i naša momčad — uživo na stadionu. Vidimo se na
						tribinama.
					</p>
				</FadeInView>

				<FadeInView direction="up" delay={0.3}>
					<Link
						href="/utakmice"
						className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white transition-colors hover:text-white/70"
					>
						Pogledaj raspored
						<ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</FadeInView>
			</div>
		</section>
	);
}
