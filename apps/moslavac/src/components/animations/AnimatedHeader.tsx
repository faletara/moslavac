"use client";

import {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
	type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface HeaderScrollState {
	logoScale: MotionValue<number>;
	scrolled: boolean;
}

const HeaderScrollContext = createContext<HeaderScrollState | null>(null);

function useHeaderScrollContext() {
	const ctx = useContext(HeaderScrollContext);
	if (!ctx) throw new Error("Must be used inside AnimatedHeader");
	return ctx;
}

export function AnimatedHeader({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const reduced = useReducedMotion();
	const [scrolled, setScrolled] = useState(false);
	const { scrollY } = useScroll();
	const height = useTransform(scrollY, [0, 80], [80, 56]);
	const logoScale = useTransform(scrollY, [0, 80], [1, 0.75]);

	useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

	return (
		<HeaderScrollContext.Provider value={{ logoScale, scrolled }}>
			<motion.header
				className={cn(
					"sticky top-0 z-50 border-b border-border/60 transition-[background-color,backdrop-filter,box-shadow] duration-300",
					scrolled
						? "bg-background/90 shadow-sm backdrop-blur-md"
						: "bg-background",
					className,
				)}
				style={reduced ? undefined : { height }}
				initial={reduced ? false : { y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.55, ease: EASE }}
			>
				{children}
			</motion.header>
		</HeaderScrollContext.Provider>
	);
}

export function AnimatedHeaderLogo({ children }: { children: ReactNode }) {
	const { logoScale } = useHeaderScrollContext();
	const reduced = useReducedMotion();
	return (
		<motion.div style={reduced ? undefined : { scale: logoScale }}>
			{children}
		</motion.div>
	);
}

const desktopStagger = {
	hidden: {},
	show: { transition: { staggerChildren: 0.07, delayChildren: 0.35 } },
};

const desktopItem = {
	hidden: { opacity: 0, y: -10 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

export function AnimatedDesktopNav({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	const reduced = useReducedMotion();
	if (reduced) return <nav className={className}>{children}</nav>;
	return (
		<motion.nav
			className={className}
			variants={desktopStagger}
			initial="hidden"
			animate="show"
		>
			{children}
		</motion.nav>
	);
}

export function AnimatedDesktopNavItem({ children }: { children: ReactNode }) {
	return <motion.div variants={desktopItem}>{children}</motion.div>;
}

const mobileStagger = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const mobileItem = {
	hidden: { opacity: 0, x: 24 },
	show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
};

export function AnimatedMobileNav({
	children,
	className,
	open,
}: {
	children: ReactNode;
	className?: string;
	open: boolean;
}) {
	const reduced = useReducedMotion();
	if (reduced) return <nav className={className}>{children}</nav>;
	return (
		<motion.nav
			key={open ? "open" : "closed"}
			className={className}
			variants={mobileStagger}
			initial="hidden"
			animate={open ? "show" : "hidden"}
		>
			{children}
		</motion.nav>
	);
}

export function AnimatedMobileNavItem({ children }: { children: ReactNode }) {
	return <motion.div variants={mobileItem}>{children}</motion.div>;
}

export function AnimatedHamburger({
	open,
	children,
}: {
	open: boolean;
	children: ReactNode;
}) {
	const reduced = useReducedMotion();
	if (reduced) return <>{children}</>;
	return (
		<motion.div
			animate={open ? { rotate: 90, scale: 0.85 } : { rotate: 0, scale: 1 }}
			transition={{ duration: 0.25, ease: EASE }}
		>
			{children}
		</motion.div>
	);
}
