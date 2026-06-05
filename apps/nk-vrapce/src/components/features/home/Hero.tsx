"use client";

import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
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
	const founded = tenant.branding?.founded ?? null;
	const nameParts = splitDisplayName(tenant.displayName);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	// Suptilni parallax na fotki + blago tonjenje sadržaja pri scrollu.
	const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
	const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
	const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

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

			{/* Tipografski blok */}
			<motion.div
				style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
				className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center"
			>
				{/* Eyebrow: žute crtice + tekst */}
				<motion.div
					className="flex items-center gap-4"
					initial={{ opacity: 0, y: reduced ? 0 : 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
				>
					<span className="h-[2px] w-8 rounded-full bg-brand-yellow" />
					<p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-yellow sm:text-xs">
						{founded ? `Osnovan ${founded}.` : "Nogometni klub"}
					</p>
					<span className="h-[2px] w-8 rounded-full bg-brand-yellow" />
				</motion.div>

				<h1
					aria-label={tenant.displayName}
					className="mt-6 select-none text-balance font-display font-extrabold uppercase leading-[0.92] tracking-tight text-brand-yellow drop-shadow-[0_6px_28px_rgba(0,0,0,0.65)] sm:mt-8"
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

				<motion.span
					aria-hidden
					className="mt-8 h-[3px] w-14 rounded-full bg-brand-yellow"
					initial={{ opacity: 0, scaleX: reduced ? 1 : 0 }}
					animate={{ opacity: 1, scaleX: 1 }}
					transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
				/>

				{tenant.branding?.motto && (
					<motion.p
						className="mt-7 max-w-md text-balance text-sm leading-relaxed text-white/75 sm:text-base"
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
						className="group inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_10px_30px_-10px_rgba(255,203,5,0.7)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-10px_rgba(255,203,5,0.85)]"
					>
						Novosti
						<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
					<Link
						href="/seniori"
						className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors hover:border-brand-yellow hover:text-brand-yellow"
					>
						Momčad
					</Link>
				</motion.div>
			</motion.div>

			{/* Scroll indikator */}
			<motion.div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 md:bottom-10"
				style={reduced ? undefined : { opacity: indicatorOpacity }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
			>
				<span className="text-[0.55rem] font-medium uppercase tracking-[0.4em] text-white/55">
					Istraži
				</span>
				<motion.span
					animate={reduced ? undefined : { y: [0, 7, 0] }}
					transition={{
						duration: 1.8,
						ease: "easeInOut",
						repeat: Number.POSITIVE_INFINITY,
					}}
				>
					<ArrowDown className="h-4 w-4 text-brand-yellow" strokeWidth={1.5} />
				</motion.span>
			</motion.div>
		</section>
	);
}
