import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeInView } from "@/components/animations";
import { CardSlider } from "@/components/features/CardSlider";
import type { RosterEntry } from "@/types/roster";

export function SquadTeaser({ players }: { players: RosterEntry[] }) {
	if (players.length === 0) return null;

	return (
		<section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
			{/* Editorial header — isti sustav kao Vijesti / Webshop */}
			<div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
				<FadeInView delay={0.1}>
					<h2 className="flex items-center gap-3 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-ink sm:text-5xl">
						<span className="h-9 w-1 rounded-full bg-brand-yellow sm:h-12" />
						Momčad
					</h2>
				</FadeInView>
				<FadeInView delay={0.15}>
					<Link
						href="/seniori"
						className="group hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue sm:inline-flex"
					>
						Cijela momčad
						<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</FadeInView>
			</div>

			<div className="mt-12">
				<CardSlider itemClassName="basis-[55%] sm:basis-1/3 lg:basis-1/5">
					{players.map((player) => (
						<SquadCard key={player.id} player={player} />
					))}
				</CardSlider>
			</div>

			{/* Mobilni "Cijela momčad" */}
			<div className="mt-10 flex justify-center sm:hidden">
				<Link
					href="/seniori"
					className="group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue"
				>
					Cijela momčad
					<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
				</Link>
			</div>
		</section>
	);
}

function SquadCard({ player }: { player: RosterEntry }) {
	const photoUrl = player.photo?.sizes?.card?.url ?? player.photo?.url ?? null;
	const ghostMark =
		player.jerseyNumber != null
			? String(player.jerseyNumber)
			: player.displayName.charAt(0);

	return (
		<Link href="/seniori" className="group block">
			<div className="relative aspect-[3/4] w-full overflow-hidden bg-black ring-1 ring-black/5 transition-all duration-300 group-hover:ring-brand-yellow/50 group-hover:shadow-[0_22px_45px_-20px_rgba(0,0,0,0.55)]">
				{photoUrl ? (
					<Image
						src={photoUrl}
						alt={player.photo?.alt || player.displayName}
						fill
						sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 55vw"
						className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
					/>
				) : (
					// Brandirani fallback — golem ghost broj/inicijal (osjećaj dresa)
					<div className="absolute inset-0 bg-gradient-to-br from-black to-brand-navy-700">
						<div
							aria-hidden
							className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full"
							style={{
								background:
									"radial-gradient(closest-side, rgba(255,203,5,0.14), transparent 70%)",
							}}
						/>
						<span
							aria-hidden
							className="absolute inset-0 flex select-none items-center justify-center text-[7rem] font-black leading-none tracking-tighter text-white/[0.07]"
						>
							{ghostMark}
						</span>
					</div>
				)}

				{/* Gradient na dnu — čitljivost imena (crni, kao Hero) */}
				<div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/55 to-transparent" />

				{player.jerseyNumber != null && (
					<span className="absolute left-3 top-3 text-3xl font-black leading-none tabular-nums text-brand-yellow drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
						{player.jerseyNumber}
					</span>
				)}
				{player.captain && (
					<span className="absolute right-3 top-3 bg-brand-blue px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white">
						Kapetan
					</span>
				)}

				{/* Ime preklopljeno preko slike */}
				<div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4">
					<span className="h-px w-6 bg-brand-yellow transition-all duration-300 group-hover:w-12" />
					<h3 className="text-balance text-sm font-bold uppercase leading-tight tracking-tight text-white sm:text-base">
						{player.displayName}
					</h3>
				</div>
			</div>
		</Link>
	);
}
