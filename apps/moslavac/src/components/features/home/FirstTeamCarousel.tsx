"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeInView, RevealHeading } from "@/components/animations";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import type { RosterPosition } from "@/types/roster";

export interface FirstLineupPlayer {
	id: number;
	displayName: string;
	position: RosterPosition;
	jerseyNumber: number | null;
	captain: boolean;
	photoUrl: string | null;
	href: string | null;
}

const positionSingular: Record<RosterPosition, string> = {
	vratar: "Vratar",
	obrambeni: "Obrambeni",
	vezni: "Vezni",
	napadac: "Napadač",
	trener: "Stručni stožer",
};

function splitDisplayNameLines(name: string): [string, string | null] {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (parts.length <= 1) return [parts[0] ?? name, null];
	return [parts[0]!, parts.slice(1).join(" ")];
}

export default function FirstTeamCarousel({
	players,
	totalPlayers,
}: {
	players: FirstLineupPlayer[];
	totalPlayers: number;
}) {
	return (
		<section className="relative overflow-hidden bg-navy-deep text-foreground dark">
			{/* Hollow watermark anchors the section */}
			<span
				aria-hidden
				className="pointer-events-none absolute -left-[1vw] -top-[3vw] select-none font-display font-black uppercase leading-none text-stroke-thin [--text-stroke-color:color-mix(in_oklab,var(--chalk)_8%,transparent)] tracking-[-0.02em] text-[17vw]"
			>
				Momčad
			</span>
			{/* Brand glow */}
			<div
				aria-hidden
				className="pointer-events-none absolute -right-40 top-1/4 size-[32rem] rounded-full bg-club/20 blur-[120px]"
			/>

			<div className="relative mx-auto w-full max-w-7xl space-y-14 px-4 py-20 sm:py-28">
				<div className="flex flex-wrap items-end justify-between gap-6 border-b border-foreground/10 pb-8">
					<div className="flex flex-col gap-3">
						<FadeInView delay={0.05}>
							<p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
								<span aria-hidden className="h-px w-8 bg-primary" />
								{totalPlayers} igrača
							</p>
						</FadeInView>
						<RevealHeading
							lines={["Prva", "momčad"]}
							delay={0.1}
							className="select-none font-display font-black uppercase leading-[0.85] tracking-[-0.02em]"
							lineClassName="text-[13vw] sm:text-6xl md:text-7xl lg:text-8xl"
						/>
					</div>
					<FadeInView delay={0.2}>
						<Link
							href="/prva-momcad"
							className="group hidden items-center gap-3 pb-2 text-xs font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-primary sm:inline-flex"
						>
							Cijela momčad
							<ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</FadeInView>
				</div>

				<FadeInView>
					<Carousel
						opts={{ align: "start", dragFree: true, containScroll: "trimSnaps" }}
						className="w-full"
					>
						<CarouselContent className="-ml-4 sm:-ml-6">
							{players.map((player) => (
								<CarouselItem
									key={player.id}
									className="basis-3/4 pl-4 sm:basis-1/3 sm:pl-6 lg:basis-1/4 xl:basis-1/5"
								>
									<PlayerPoster player={player} />
								</CarouselItem>
							))}
						</CarouselContent>

						{/* Controls below the cards */}
						<div className="mt-12 flex items-center gap-2">
							<CarouselPrevious className="static size-11 translate-y-0 rounded-full border-foreground/20 bg-transparent text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground" />
							<CarouselNext className="static size-11 translate-y-0 rounded-full border-foreground/20 bg-transparent text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground" />
						</div>
					</Carousel>
				</FadeInView>

				<FadeInView delay={0.1}>
					<Link
						href="/prva-momcad"
						className="group flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-foreground transition-colors hover:text-primary sm:hidden"
					>
						Cijela momčad
						<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</FadeInView>
			</div>
		</section>
	);
}

function PlayerPoster({ player }: { player: FirstLineupPlayer }) {
	const reduced = useReducedMotion();
	const [nameLineOne, nameLineTwo] = splitDisplayNameLines(player.displayName);
	const initials = player.displayName
		.split(/\s+/)
		.map((p) => p[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<motion.div
			whileHover={reduced ? undefined : { y: -6 }}
			transition={{ duration: 0.25 }}
		>
			<Link
				href={player.href ?? "/prva-momcad"}
				aria-label={
					player.href
						? `Statistika igrača ${player.displayName}`
						: `Prva momčad, ${player.displayName}`
				}
				className="group relative block aspect-3/4 overflow-hidden bg-linear-to-b from-club/30 to-navy-deep ring-1 ring-foreground/10 transition-shadow duration-500 hover:ring-primary/50 hover:shadow-[0_20px_60px_-20px_var(--club)]"
			>
				{player.photoUrl ? (
					<Image
						src={player.photoUrl}
						alt={player.displayName}
						fill
						sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 75vw"
						className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
					/>
				) : (
					<div className="flex size-full items-center justify-center">
						<span className="select-none font-display font-black uppercase leading-none tracking-tighter text-6xl text-foreground/15">
							{initials}
						</span>
					</div>
				)}

				{/* Cinematic gradient base */}
				<div
					aria-hidden
					className="absolute inset-0 bg-linear-to-t from-navy-deep via-navy-deep/30 to-transparent"
				/>
				{/* Club-blue wash that warms up on hover */}
				<div
					aria-hidden
					className="absolute inset-0 bg-linear-to-t from-club/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				/>

				{/* Jersey number — stroked watermark */}
				{player.jerseyNumber != null && (
					<span
						aria-hidden
						className="pointer-events-none absolute -bottom-3 right-2 select-none font-display font-black tabular-nums leading-none text-stroke-thin [--text-stroke-color:color-mix(in_oklab,var(--chalk)_45%,transparent)] text-7xl text-transparent transition-all duration-500 group-hover:[--text-stroke-color:var(--primary)] sm:text-8xl"
					>
						{String(player.jerseyNumber).padStart(2, "0")}
					</span>
				)}

				{player.captain && (
					<span className="absolute left-3 top-3 inline-flex items-center bg-primary px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.25em] text-primary-foreground sm:text-[0.55rem]">
						Kapetan
					</span>
				)}

				{/* Name plate */}
				<div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:p-5">
					<div className="flex items-center gap-2">
						<span
							aria-hidden
							className="h-px w-5 bg-primary transition-all duration-300 group-hover:w-9"
						/>
						<span className="text-[0.55rem] font-medium uppercase tracking-[0.3em] text-chalk/70 sm:text-[0.6rem]">
							{positionSingular[player.position]}
						</span>
					</div>
					<h3
						aria-label={player.displayName}
						className="grid min-h-[1.8em] max-w-[80%] grid-rows-2 font-display text-xl font-black uppercase leading-[0.9] tracking-normal text-chalk sm:text-2xl"
					>
						<span className="block whitespace-nowrap">{nameLineOne}</span>
						<span
							aria-hidden={nameLineTwo == null}
							className={
								nameLineTwo == null ? "block invisible" : "block whitespace-nowrap"
							}
						>
							{nameLineTwo ?? nameLineOne}
						</span>
					</h3>
				</div>

				{/* Accent rule grows on hover */}
				<span
					aria-hidden
					className="absolute bottom-0 left-0 h-1 w-12 bg-primary transition-all duration-500 ease-out group-hover:w-full"
				/>
			</Link>
		</motion.div>
	);
}
