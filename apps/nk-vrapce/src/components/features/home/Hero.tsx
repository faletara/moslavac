"use client";

import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { FrontendTenant } from "@/lib/payload/types";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE = [0.25, 0.1, 0.25, 1] as const;

/**
 * Hero pozadinska fotka — stadion NK Vrapče (autentična, žuto-plavi brand
 * elementi: plave stolice + žuta ograda). Zamjenjiva: ubaci novu u /public.
 */
const HERO_IMAGE = "/stadion.png";

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
	const nameParts = splitDisplayName(tenant.displayName);
	const founded = tenant.branding?.founded ?? null;

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	// Suptilni parallax na fotki + blago tonjenje sadržaja pri scrollu.
	const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
	const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

	return (
		<section
			ref={sectionRef}
			className="relative isolate -mt-[5.5rem] flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-brand-navy"
		>
			{/* Full-bleed klupska fotka + suptilni parallax (overscan da nema rubova) */}
			<motion.div
				aria-hidden
				className="pointer-events-none absolute -inset-[6%] -z-30"
				style={reduced ? undefined : { y: photoY }}
				initial={{ opacity: 0, scale: 1.06 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 1.4, ease: EASE }}
			>
				<Image
					src={HERO_IMAGE}
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-[center_62%]"
				/>
			</motion.div>

			{/* Neutralno tamni scrim — čitljivost bez plavog tona, da žuta dominira.
          Vrh i dno tamniji, sredina jasnija. */}
			<div aria-hidden className="absolute inset-0 -z-20 bg-black/45" />
			<div
				aria-hidden
				className="absolute inset-0 -z-20 bg-gradient-to-b from-black/75 via-black/20 to-black/85"
			/>
			{/* Vignette za fokus na natpis */}
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.5)_100%)]" />
			{/* Fade u navy na dnu — bešavni prijelaz u tamnu Rezultati sekciju */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-b from-transparent to-brand-navy"
			/>

			{/* Tipografski blok */}
			<motion.div
				style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
				className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center"
			>
				{/* Eyebrow — godina osnutka uokvirena žutim crtama */}
				{founded && (
					<motion.div
						className="flex items-center gap-4 text-brand-yellow"
						initial={{ opacity: 0, y: reduced ? 0 : 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
					>
						<span className="h-px w-8 bg-brand-yellow/60 sm:w-12" />
						<span className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] sm:text-xs">
							Osnovano {founded}.
						</span>
						<span className="h-px w-8 bg-brand-yellow/60 sm:w-12" />
					</motion.div>
				)}

				<h1
					aria-label={tenant.displayName}
					className="mt-5 select-none text-balance font-display font-extrabold uppercase leading-[0.92] tracking-tight text-brand-yellow drop-shadow-[0_6px_28px_rgba(0,0,0,0.65)] sm:mt-6"
				>
					{nameParts.map((part, idx) => (
						<span
							key={part}
							className="block overflow-hidden pb-[0.06em] pt-[0.42em]"
						>
							<motion.span
								className="block text-[clamp(3.5rem,15vw,9.5rem)]"
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
						className="mt-7 max-w-md text-balance text-sm leading-relaxed text-white/75 sm:text-base"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
					>
						{tenant.branding.motto}
					</motion.p>
				)}

				{/* CTA-i */}
				<motion.div
					className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
					initial={{ opacity: 0, y: reduced ? 0 : 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.95, ease: EASE }}
				>
					<Link
						href="/novosti"
						className="inline-flex w-full items-center justify-center bg-brand-yellow px-7 py-3 text-sm font-bold uppercase tracking-wide text-black transition-colors hover:bg-white sm:w-56"
					>
						Najnovije vijesti
					</Link>
					<Link
						href="/seniori"
						className="inline-flex w-full items-center justify-center border border-white/40 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:border-brand-yellow hover:text-brand-yellow sm:w-56"
					>
						Naša momčad
					</Link>
				</motion.div>
			</motion.div>
		</section>
	);
}
