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
	const animated = useRef(false);

	// Count up once the value scrolls into view.
	useEffect(() => {
		if (animated.current || !isInView) return;

		if (reduced) {
			animated.current = true;
			setDisplay(value);
			return;
		}

		animated.current = true;
		const controls = animate(0, value, {
			duration: 1,
			ease: [0.25, 0.1, 0.25, 1],
			onUpdate: (latest) => setDisplay(Math.round(latest)),
		});

		return () => controls.stop();
	}, [isInView, value, reduced]);

	// Safety net: if the IntersectionObserver never fires for an element that is
	// actually on screen (seen on some mobile browsers), still show the value so
	// it never stays stuck at 0. Off-screen elements are left for the observer so
	// the count-up still plays when they're scrolled into view.
	useEffect(() => {
		const id = setTimeout(() => {
			if (animated.current) return;
			const el = ref.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
			if (onScreen) {
				animated.current = true;
				setDisplay(value);
			}
		}, 1200);

		return () => clearTimeout(id);
	}, [value]);

	return (
		<motion.span ref={ref} className={className}>
			{display}
			{suffix}
		</motion.span>
	);
}
