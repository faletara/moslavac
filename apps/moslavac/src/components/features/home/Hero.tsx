"use client";

import {
	motion,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Ticker } from "@/components/animations";
import type { FrontendTenant } from "@/lib/payload/types";

type HeroProps = {
	tenant: FrontendTenant;
};

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function Hero({ tenant }: HeroProps) {
	const reduced = useReducedMotion();
	const sectionRef = useRef<HTMLElement>(null);
	const founded = tenant.branding?.founded ?? null;
	const motto = tenant.branding?.motto ?? null;
	const { prefix, main } = splitDisplayName(tenant.displayName);
	const letters = toKeyedLetters(main.toUpperCase());

	const tickerItems = [
		tenant.displayName.toUpperCase(),
		motto?.toUpperCase() ?? null,
		founded ? `OD ${founded}.` : null,
	].filter((v): v is string => Boolean(v));

	// Scroll-driven parallax: layers drift at different speeds for depth.
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
	const watermarkY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
	const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
	const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

	// Pointer-driven parallax (desktop): smooth spring-tracked cursor offset.
	const px = useMotionValue(0);
	const py = useMotionValue(0);
	const sx = useSpring(px, { stiffness: 50, damping: 18, mass: 0.6 });
	const sy = useSpring(py, { stiffness: 50, damping: 18, mass: 0.6 });
	const watermarkX = useTransform(sx, [-1, 1], [-30, 30]);
	const watermarkPointerY = useTransform(sy, [-1, 1], [-18, 18]);
	const headingX = useTransform(sx, [-1, 1], [-12, 12]);
	const headingPointerY = useTransform(sy, [-1, 1], [-8, 8]);

	function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
		if (reduced || e.pointerType !== "mouse") return;
		const rect = e.currentTarget.getBoundingClientRect();
		px.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
		py.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
	}

	function resetPointer() {
		px.set(0);
		py.set(0);
	}

	return (
		<section
			ref={sectionRef}
			onPointerMove={handlePointerMove}
			onPointerLeave={resetPointer}
			className="dark relative isolate -mt-20 flex min-h-svh w-full flex-col overflow-hidden bg-navy-deep text-foreground"
		>
			{/* Floodlit photo backdrop — grayscale shot tinted club-blue */}
			<motion.div
				aria-hidden
				className="absolute inset-0 -z-30"
				style={reduced ? undefined : { y: bgY }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1.4, ease: EASE }}
			>
				<Image
					src="/naslovna.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover opacity-50 grayscale"
				/>
				<div className="absolute inset-0 bg-club mix-blend-color" />
				<div className="absolute inset-0 bg-linear-to-b from-navy-deep/90 via-navy-deep/55 to-navy-deep" />
			</motion.div>

			{/* Floodlight glows */}
			<div
				aria-hidden
				className="absolute -top-[20vw] left-[15%] -z-20 size-[55vw] rounded-full bg-club/25 blur-[120px]"
			/>
			<div
				aria-hidden
				className="absolute -right-[10vw] top-1/3 -z-20 size-[38vw] rounded-full bg-club/15 blur-[100px]"
			/>

			{/* Founded year — hollow display watermark with depth parallax */}
			{founded && (
				<motion.div
					aria-hidden
					className="pointer-events-none absolute -bottom-[4vw] right-0 -z-10 select-none"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 2, delay: 0.9, ease: EASE }}
				>
					<motion.span
						className="block font-display font-black leading-none text-stroke [--text-stroke-color:color-mix(in_oklab,var(--chalk)_22%,transparent)] text-[44vw] md:text-[30vw]"
						style={
							reduced
								? undefined
								: { y: watermarkY, x: watermarkX, marginTop: watermarkPointerY }
						}
					>
						{founded}
					</motion.span>
				</motion.div>
			)}

			{/* Centre stage */}
			<motion.div
				style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
				className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-28 pb-20 text-center sm:px-10 md:pt-32"
			>
				{/* Eyebrow: crest + founding line */}
				<motion.div
					className="flex items-center gap-4"
					initial={{ opacity: 0, y: reduced ? 0 : 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
				>
					<Image
						src="/grb.png"
						alt=""
						width={44}
						height={44}
						priority
						className="size-10 md:size-11"
					/>
					<span aria-hidden className="h-8 w-px bg-foreground/20" />
					<p className="text-left text-[0.6rem] font-medium uppercase tracking-[0.3em] text-foreground/70 sm:text-xs sm:tracking-[0.4em]">
						Nogometni klub
						{founded && (
							<>
								<br />
								<span className="text-foreground/45">Osnovan {founded}.</span>
							</>
						)}
					</p>
				</motion.div>

				{/* Club name — prefix line + letter-staggered main word */}
				<h1
					aria-label={tenant.displayName}
					className="mt-8 select-none font-display font-black uppercase md:mt-10"
				>
					{prefix && (
						<motion.span
							aria-hidden
							className="mb-1 flex items-center justify-center gap-4 text-[clamp(1.4rem,4vw,2.75rem)] leading-none tracking-[0.55em] text-foreground/60 [text-indent:0.55em]"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
						>
							<span aria-hidden className="h-px w-10 bg-foreground/40" />
							{prefix}
							<span aria-hidden className="h-px w-10 bg-foreground/40" />
						</motion.span>
					)}
					<motion.span
						aria-hidden
						className="block overflow-hidden leading-[0.84] tracking-[-0.01em] text-[clamp(4rem,21vw,19rem)]"
						style={reduced ? undefined : { x: headingX, y: headingPointerY }}
					>
						{letters.map(({ char, key }, i) => (
							<motion.span
								key={key}
								className="inline-block whitespace-pre"
								initial={{ y: reduced ? 0 : "110%" }}
								animate={{ y: 0 }}
								transition={{
									duration: 0.85,
									delay: 0.3 + i * 0.045,
									ease: EXPO_OUT,
								}}
							>
								{char}
							</motion.span>
						))}
					</motion.span>
				</h1>

				{/* CTAs */}
				<motion.div
					className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-8"
					initial={{ opacity: 0, y: reduced ? 0 : 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 1.15, ease: EASE }}
				>
					<a
						href="#utakmice"
						className="group inline-flex items-center gap-3 rounded-full bg-chalk px-8 py-3.5 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-navy-deep transition-colors duration-300 hover:bg-club hover:text-chalk sm:text-xs"
					>
						Sljedeća utakmica
						<ArrowDown
							className="size-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
							strokeWidth={2.5}
						/>
					</a>
					<Link
						href="/prva-momcad"
						className="group inline-flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-foreground/70 transition-colors duration-300 hover:text-foreground sm:text-xs"
					>
						Naša momčad
						<ArrowRight
							className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
							strokeWidth={2.5}
						/>
					</Link>
				</motion.div>
			</motion.div>

			{/* Scroll cue */}
			<motion.div
				aria-hidden
				className="pointer-events-none relative z-10 mb-5 flex justify-center"
				style={reduced ? undefined : { opacity: indicatorOpacity }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 1.6, ease: EASE }}
			>
				<motion.span
					animate={reduced ? undefined : { y: [0, 7, 0] }}
					transition={{
						duration: 1.8,
						ease: "easeInOut",
						repeat: Number.POSITIVE_INFINITY,
					}}
				>
					<ArrowDown className="size-4 text-foreground/60" strokeWidth={1.5} />
				</motion.span>
			</motion.div>

			{/* Marquee strip along the hero base */}
			<motion.div
				className="relative z-10 border-t border-foreground/10"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
			>
				<Ticker
					items={tickerItems}
					duration={30}
					className="py-4"
					itemClassName="font-display text-lg font-semibold uppercase tracking-[0.3em] text-foreground/50"
				/>
			</motion.div>
		</section>
	);
}

/** Stable per-letter keys: each repeated character gets an occurrence index. */
function toKeyedLetters(word: string): { char: string; key: string }[] {
	const seen = new Map<string, number>();
	return [...word].map((char) => {
		const count = seen.get(char) ?? 0;
		seen.set(char, count + 1);
		return { char, key: `${char}${count}` };
	});
}

function splitDisplayName(displayName: string): {
	prefix: string | null;
	main: string;
} {
	const trimmed = displayName.trim();
	const parts = trimmed.split(/\s+/);
	if (parts.length <= 1) return { prefix: null, main: trimmed || displayName };
	const [first, ...rest] = parts;
	return { prefix: first ?? null, main: rest.join(" ") };
}
