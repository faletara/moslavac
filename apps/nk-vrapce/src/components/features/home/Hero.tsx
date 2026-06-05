"use client";

import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { FrontendTenant } from "@/lib/payload/types";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE = [0.25, 0.1, 0.25, 1] as const;

function splitDisplayName(displayName: string): string[] {
	const trimmed = displayName.trim();
	if (!trimmed) return [displayName];
	const parts = trimmed.split(/\s+/);
	if (parts.length <= 1) return parts;
	const [first, ...rest] = parts;
	return first ? [first, rest.join(" ")] : parts;
}

export default function Hero({ tenant }: { tenant: FrontendTenant }) {
	const reduced = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);
	const founded = tenant.branding?.founded ?? null;
	const nameParts = splitDisplayName(tenant.displayName);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	// Suptilni parallax na zgradi pri dnu — mirno, jedva primjetno.
	const buildingY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

	return (
		<section
			ref={sectionRef}
			className="relative isolate flex min-h-[calc(100svh-5.5rem)] w-full flex-col items-center justify-center overflow-hidden bg-surface"
		>
			{/* Bolnica Vrapče — povijesni motiv kluba kao tiha, ujednačena
          tekstura kroz cijeli hero (jedva vidljiva). */}
			<motion.div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-30"
				style={reduced ? undefined : { y: buildingY }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1.4, ease: EASE }}
			>
				<Image
					src="/bolnica-colored.png"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
			</motion.div>
			{/* Jak bijeli wash — zgrada ostaje samo suptilna podloga, a svi
          rubovi (vrh, dno) se mekano stapaju u bijelu. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-surface via-surface/72 to-surface"
			/>
			{/* Bočni fade — meki rubovi */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-r from-surface/85 via-transparent to-surface/85"
			/>

			{/* Tipografski blok */}
			<div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
				{/* Eyebrow: tanka linija + osnovan, plava kao sekundarni akcent */}
				<motion.div
					className="flex items-center gap-4"
					initial={{ opacity: 0, y: reduced ? 0 : 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
				>
					<span className="h-px w-8 bg-brand-blue/40" />
					<p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-blue sm:text-xs">
						{founded ? `Osnovan ${founded}.` : "Nogometni klub"}
					</p>
					<span className="h-px w-8 bg-brand-blue/40" />
				</motion.div>

				<h1
					aria-label={tenant.displayName}
					className="mt-6 select-none text-balance font-display font-extrabold uppercase leading-[0.92] tracking-tight text-ink sm:mt-8"
				>
					{nameParts.map((part, idx) => (
						<span
							key={part}
							className={`block overflow-hidden pb-[0.04em] pt-[0.22em] ${
								idx > 0 ? "-mt-[0.18em]" : ""
							}`}
						>
							<motion.span
								className="block text-[clamp(2.75rem,11vw,7rem)]"
								initial={{ y: reduced ? 0 : "108%" }}
								animate={{ y: 0 }}
								transition={{
									duration: 0.8,
									delay: 0.25 + idx * 0.12,
									ease: EXPO_OUT,
								}}
							>
								{part}
							</motion.span>
						</span>
					))}
				</h1>

				{tenant.branding?.motto && (
					<motion.p
						className="mt-7 max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
					>
						{tenant.branding.motto}
					</motion.p>
				)}

				<motion.div
					className="mt-9 flex flex-wrap items-center justify-center gap-3"
					initial={{ opacity: 0, y: reduced ? 0 : 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.95, ease: EASE }}
				>
					<Link
						href="/novosti"
						className="group inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_10px_30px_-12px_rgba(255,203,5,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(255,203,5,0.9)]"
					>
						Novosti
						<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
					<Link
						href="/seniori"
						className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-navy backdrop-blur-sm transition-colors hover:border-brand-navy/30 hover:bg-surface"
					>
						Momčad
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
