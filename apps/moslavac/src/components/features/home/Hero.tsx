"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant } from "@/lib/payload/types";

type HeroProps = {
	tenant: FrontendTenant;
};

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function Hero({ tenant }: HeroProps) {
	const reduced = useReducedMotion();
	const founded = tenant.branding?.founded ?? null;
	const motto =
		tenant.branding?.motto ??
		"Više od devet desetljeća popovačkog nogometa. Strast, ponos i klub koji pišemo zajedno.";
	const nameParts = splitDisplayName(tenant.displayName);
	const taglinePrefix = founded ? `Osnovan ${founded}` : tenant.displayName;

	return (
		<section className="relative isolate flex min-h-svh w-full flex-col items-center justify-center overflow-hidden md:min-h-screen md:py-24">
			{/* Background image */}
			<motion.div
				className="absolute inset-0 -z-20"
				initial={{ opacity: 0, scale: reduced ? 1 : 1.05 }}
				animate={{ opacity: 0.06, scale: 1 }}
				transition={{ duration: 1.2, ease: EASE }}
			>
				<Image
					src="/naslovna.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover grayscale"
				/>
			</motion.div>

			{/* Founded year watermark */}
			{founded && (
				<motion.span
					aria-hidden
					className="pointer-events-none absolute -bottom-6 right-2 -z-10 select-none font-black leading-none tracking-tighter text-foreground/5 text-[42vw] md:-bottom-12 md:right-6 md:text-[26vw]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 2, delay: 0.8, ease: EASE }}
				>
					{founded}
				</motion.span>
			)}

			<div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10 md:max-w-6xl md:flex-none md:px-6 md:py-0">
				<div className="flex flex-col items-center gap-4">
					{/* Decorative line */}
					<motion.span
						className="h-px w-12 bg-foreground"
						initial={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
						style={{ transformOrigin: "center" }}
					/>

					{/* Grb + tagline */}
					<motion.div
						className="flex items-center gap-3"
						initial={{ opacity: 0, y: reduced ? 0 : 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
					>
						<Image
							src="/grb.png"
							alt=""
							width={36}
							height={36}
							priority
							className="h-9 w-9 md:h-10 md:w-10"
						/>
						<p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
							{taglinePrefix}
						</p>
					</motion.div>
				</div>

				{/* Main heading — word reveal */}
				<h1
					aria-label={tenant.displayName}
					className="mt-10 select-none text-balance font-black uppercase leading-[0.85] tracking-tighter md:mt-12"
				>
					{nameParts.map((part, idx) => (
						<span key={part} className="block overflow-hidden">
							<motion.span
								className="block text-[15vw] md:text-[14vw]"
								initial={{ y: reduced ? 0 : "110%" }}
								animate={{ y: 0 }}
								transition={{
									duration: 0.7,
									delay: 0.3 + idx * 0.15,
									ease: EXPO_OUT,
								}}
							>
								{part}
							</motion.span>
						</span>
					))}
				</h1>

				{/* Motto */}
				<motion.p
					className="mx-auto mt-8 max-w-md text-balance text-sm leading-relaxed text-muted-foreground md:mt-10 md:max-w-xl md:text-base"
					initial={{ opacity: 0, y: reduced ? 0 : 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
				>
					{motto}
				</motion.p>

				{/* CTA */}
				<motion.div
					className="mt-10 md:mt-12"
					initial={{ opacity: 0, y: reduced ? 0 : 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
				>
					<Link
						href="#sljedeca-utakmica"
						className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground"
					>
						Saznaj više
						<ArrowDown className="size-3 transition-transform duration-300 group-hover:translate-y-1" />
					</Link>
				</motion.div>
			</div>
		</section>
	);
}

function splitDisplayName(displayName: string): string[] {
	const trimmed = displayName.trim();
	if (!trimmed) return [displayName];
	const parts = trimmed.split(/\s+/);
	if (parts.length <= 1) return parts;
	const [first, ...rest] = parts;
	return first ? [first, rest.join(" ")] : parts;
}
