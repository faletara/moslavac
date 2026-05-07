"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedLine, FadeInView } from "@/components/animations";

export default function SeasonTicketPromoSection() {
	return (
		<section className="w-full px-4 py-16 sm:py-24">
			<div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
				<FadeInView direction="left">
					<div className="relative aspect-4/3 w-full overflow-hidden md:aspect-square">
						<Image
							src="/fans.jpg"
							alt="SNK Moslavac navijači"
							fill
							sizes="(min-width: 768px) 50vw, 100vw"
							className="object-cover grayscale"
						/>
					</div>
				</FadeInView>

				<FadeInView direction="right" delay={0.15}>
					<div className="flex flex-col items-start gap-8">
						<div className="flex flex-col items-start gap-4">
							<AnimatedLine />
							<p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
								Sezonska iskaznica
							</p>
						</div>

						<h2 className="select-none text-balance font-black uppercase leading-[0.85] tracking-tighter">
							<span className="block text-[14vw] sm:text-6xl md:text-6xl lg:text-7xl">
								Postani naš
							</span>
							<span className="block text-[14vw] sm:text-6xl md:text-6xl lg:text-7xl">
								12. igrač
							</span>
						</h2>

						<p className="max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
							Osiguraj svoje mjesto na tribinama i podržavaj svoj klub tijekom
							cijele sezone.
						</p>

						<Link
							href="/season-ticket"
							className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground"
						>
							Kupi iskaznicu
							<ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</div>
				</FadeInView>
			</div>
		</section>
	);
}
