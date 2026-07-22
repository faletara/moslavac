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
	format?: (value: number) => string;
}

export function AnimatedCounter({
	value,
	className,
	suffix = "",
	format,
}: AnimatedCounterProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const reduced = useReducedMotion();
	const inView = useInView(ref, { once: true });
	// Start at the final value so the server-rendered HTML carries the real
	// number (crawlers/no-JS see the fact, not "0"); the count-up resets to 0
	// and animates only once the element scrolls into view on the client.
	const count = useMotionValue(value);
	const render = (latest: number) =>
		`${format ? format(Math.round(latest)) : Math.round(latest)}${suffix}`;
	const text = useTransform(count, render);

	useEffect(() => {
		if (!inView || reduced) return;
		count.jump(0);
		const controls = animate(count, value, { duration: 0.9, ease: "easeOut" });
		return () => controls.stop();
	}, [inView, reduced, value, count]);

	if (reduced) {
		return (
			<span ref={ref} className={className}>
				{render(value)}
			</span>
		);
	}

	return (
		<motion.span ref={ref} className={className}>
			{text}
		</motion.span>
	);
}
