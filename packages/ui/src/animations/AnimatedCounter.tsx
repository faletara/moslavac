"use client";

import {
	animate,
	motion,
	useInView,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
	value: number;
	className?: string;
	suffix?: string;
}

export function AnimatedCounter({ value, className, suffix = "" }: AnimatedCounterProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const reduced = useReducedMotion();
	const inView = useInView(ref, { once: true });
	const count = useMotionValue(0);
	const text = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);

	useEffect(() => {
		if (!inView || reduced) return;
		const controls = animate(count, value, { duration: 0.9, ease: "easeOut" });
		return () => controls.stop();
	}, [inView, reduced, value, count]);

	if (reduced) {
		return (
			<span ref={ref} className={className}>
				{`${Math.round(value)}${suffix}`}
			</span>
		);
	}

	return (
		<motion.span ref={ref} className={className}>
			{text}
		</motion.span>
	);
}
