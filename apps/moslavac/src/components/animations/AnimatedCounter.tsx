"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
	value: number;
	className?: string;
	suffix?: string;
}

export function AnimatedCounter({ value, className, suffix = "" }: AnimatedCounterProps) {
	const reduced = useReducedMotion();
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-80px" });
	const [display, setDisplay] = useState(0);

	useEffect(() => {
		if (!isInView) return;

		if (reduced) {
			setDisplay(value);
			return;
		}

		const controls = animate(0, value, {
			duration: 1,
			ease: [0.25, 0.1, 0.25, 1],
			onUpdate: (latest) => setDisplay(Math.round(latest)),
		});

		return () => controls.stop();
	}, [isInView, value, reduced]);

	return (
		<motion.span ref={ref} className={className}>
			{display}
			{suffix}
		</motion.span>
	);
}
