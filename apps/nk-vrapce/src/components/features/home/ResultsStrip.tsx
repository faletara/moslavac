import Image from "next/image";
import { FadeInView } from "@/components/animations";
import { CardSlider } from "@/components/features/CardSlider";
import type { PlayedMatchSummary } from "@/lib/helpers/form";
import type { HnsTeam } from "@/types/hns";

function teamLogo(team: HnsTeam | null): string | null {
	return team?.picture ? `/api/images/${team.picture}` : null;
}

const DATE_FMT = new Intl.DateTimeFormat("hr-HR", {
	day: "2-digit",
	month: "long",
});

// HNS vraća kolo kao goli broj ("30") ili već s tekstom ("30. kolo"). Ako je
// samo broj, dodamo "kolo" da korisniku bude jasno o čemu se radi.
function formatRound(round: string): string {
	const trimmed = round.trim();
	return /^\d+$/.test(trimmed) ? `${trimmed}. kolo` : trimmed;
}

// Odrezani donji-desni kut — signature oblik kartice (PSG-style).
const CLIP =
	"[clip-path:polygon(0_0,100%_0,100%_calc(100%-1.5rem),calc(100%-1.5rem)_100%,0_100%)]";

function TeamRow({
	team,
	score,
	won,
}: {
	team: HnsTeam | null;
	score: number;
	won: boolean;
}) {
	const logo = teamLogo(team);
	return (
		<div className="flex items-center gap-3">
			<span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-navy/5 ring-1 ring-brand-navy/10">
				{logo ? (
					<Image
						src={logo}
						alt=""
						width={32}
						height={32}
						className="size-6 object-contain"
					/>
				) : (
					<span className="text-[0.65rem] font-bold text-brand-navy">
						{team?.name?.charAt(0) ?? "?"}
					</span>
				)}
			</span>
			<span
				className={`flex-1 truncate font-display text-base font-extrabold uppercase leading-none tracking-tight sm:text-lg ${
					won ? "text-brand-navy" : "text-brand-navy/45"
				}`}
			>
				{team?.name ?? "—"}
			</span>
			<span
				className={`font-display text-2xl font-extrabold leading-none tabular-nums ${
					won ? "text-brand-navy" : "text-brand-navy/45"
				}`}
			>
				{score}
			</span>
		</div>
	);
}

export function ResultsStrip({ results }: { results: PlayedMatchSummary[] }) {
	if (results.length === 0) return null;

	return (
		<section className="bg-brand-navy">
			<div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
				<FadeInView>
					<div className="mb-10 flex items-end justify-between gap-6 border-b border-white/15 pb-6">
						<h2 className="flex items-center gap-3 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-white sm:text-5xl">
							<span className="h-9 w-1 rounded-full bg-brand-yellow sm:h-12" />
							Rezultati
						</h2>
					</div>
				</FadeInView>

				<CardSlider
					tone="dark"
					itemClassName="basis-[85%] sm:basis-1/2 lg:basis-1/3"
				>
					{results.map((r, i) => {
						const m = r.match;
						const home = m.homeTeamResult?.current ?? 0;
						const away = m.awayTeamResult?.current ?? 0;
						const d = m.dateTimeUTC ? new Date(m.dateTimeUTC) : null;
						return (
							<article
								key={m.id ?? i}
								className={`group relative h-full overflow-hidden bg-white shadow-[0_24px_50px_-28px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-1 ${CLIP}`}
							>
								{/* Grb kao suptilni watermark — brand-tekstura */}
								<Image
									aria-hidden
									src="/grb-vrapce.png"
									alt=""
									width={180}
									height={180}
									className="pointer-events-none absolute -bottom-5 -right-5 size-32 opacity-[0.06]"
								/>
								<div className="relative flex flex-col gap-6 p-6">
									<div className="flex flex-wrap items-center gap-2.5">
										<span className="bg-brand-yellow px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-brand-navy">
											Završeno
										</span>
										{m.round && (
											<span className="border border-brand-navy/15 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.15em] text-brand-navy/70">
												{formatRound(m.round)}
											</span>
										)}
										<span className="text-[0.55rem] font-medium uppercase tracking-[0.2em] text-brand-navy/45">
											{d ? DATE_FMT.format(d) : ""}
										</span>
									</div>
									<div className="flex flex-col gap-3.5">
										<TeamRow team={m.homeTeam} score={home} won={home > away} />
										<TeamRow team={m.awayTeam} score={away} won={away > home} />
									</div>
								</div>
							</article>
						);
					})}
				</CardSlider>
			</div>
		</section>
	);
}
