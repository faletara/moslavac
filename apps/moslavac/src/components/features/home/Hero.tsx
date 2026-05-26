"use client";

import {
	motion,
	useMotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
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
	const nameParts = splitDisplayName(tenant.displayName);
	const taglinePrefix = founded ? `Osnovan ${founded}` : tenant.displayName;

	// Scroll-driven parallax: layers drift at different speeds for depth.
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
	const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
	// 1933 watermark: drifts up and reveals (darkens) as the hero exits.
	const watermarkY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
	const watermarkOpacity = useTransform(
		scrollYProgress,
		[0, 0.6, 1],
		[0.33, 0.7, 1],
	);
	const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
	const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
	const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

	// Pointer-driven parallax (desktop): smooth spring-tracked cursor offset.
	const px = useMotionValue(0);
	const py = useMotionValue(0);
	const sx = useSpring(px, { stiffness: 50, damping: 18, mass: 0.6 });
	const sy = useSpring(py, { stiffness: 50, damping: 18, mass: 0.6 });
	const watermarkX = useTransform(sx, [-1, 1], [-26, 26]);
	const watermarkPointerY = useTransform(sy, [-1, 1], [-16, 16]);
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
			className="relative isolate flex min-h-svh w-full flex-col items-center justify-center overflow-hidden md:min-h-screen md:py-24"
		>
			{/* Background image — scroll parallax + Ken Burns drift */}
			<motion.div
				className="absolute inset-0 -z-20"
				style={reduced ? undefined : { y: bgY, scale: bgScale }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.06 }}
				transition={{ duration: 1.2, ease: EASE }}
			>
				<motion.div
					className="absolute inset-0"
					initial={{ scale: reduced ? 1 : 1.08 }}
					animate={reduced ? { scale: 1 } : { scale: [1.08, 1, 1.08] }}
					transition={
						reduced
							? { duration: 1.2, ease: EASE }
							: {
									duration: 28,
									ease: "easeInOut",
									repeat: Number.POSITIVE_INFINITY,
								}
					}
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
			</motion.div>

			{/* Founded year watermark — scales up into a wipe as the hero exits */}
			{founded && (
				<motion.div
					aria-hidden
					className="pointer-events-none absolute -bottom-6 right-2 -z-10 select-none md:-bottom-12 md:right-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 2, delay: 0.8, ease: EASE }}
				>
					<motion.div
						style={
							reduced
								? { opacity: 0.35 }
								: { y: watermarkY, opacity: watermarkOpacity }
						}
					>
						<motion.span
							className="block font-black leading-none tracking-tighter text-foreground/15 text-[42vw] md:text-[26vw]"
							style={
								reduced ? undefined : { x: watermarkX, y: watermarkPointerY }
							}
						>
							{founded}
						</motion.span>
					</motion.div>
				</motion.div>
			)}

			<motion.div
				style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
				className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10 md:max-w-6xl md:flex-none md:px-6 md:py-0"
			>
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

				{/* Main heading — word reveal + pointer parallax */}
				<motion.h1
					aria-label={tenant.displayName}
					className="mt-10 select-none text-balance font-black uppercase leading-[0.85] tracking-tighter md:mt-12"
					style={reduced ? undefined : { x: headingX, y: headingPointerY }}
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
				</motion.h1>
			</motion.div>

			{/* Scroll indicator — fades out as the user scrolls */}
			<motion.div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 md:bottom-10"
				style={reduced ? undefined : { opacity: indicatorOpacity }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 1.4, ease: EASE }}
			>
				<span className="text-[0.55rem] font-medium uppercase tracking-[0.4em] text-muted-foreground">
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
					<ArrowDown className="h-4 w-4 text-foreground/70" strokeWidth={1.5} />
				</motion.span>
			</motion.div>
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
