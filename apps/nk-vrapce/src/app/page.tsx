import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
	FadeInView,
	StaggerContainer,
	StaggerItem,
} from "@/components/animations";
import { CardSlider } from "@/components/features/CardSlider";
import Hero from "@/components/features/home/Hero";
import { ResultsStrip } from "@/components/features/home/ResultsStrip";
import { SquadTeaser } from "@/components/features/home/SquadTeaser";
import { StandingsTable } from "@/components/features/home/StandingsTable";
import { formatDateShort } from "@/lib/helpers/date";
import { getRecentForm } from "@/lib/helpers/form";
import { getHnsTeamId } from "@/lib/hns/client";
import {
	fetchCompetitionMatches,
	fetchSeniorCompetition,
} from "@/lib/hns/competitions";
import { fetchTeamStandings } from "@/lib/hns/standings";
import { fetchFeaturedEquipment } from "@/lib/payload/getEquipment";
import { fetchAlbums } from "@/lib/payload/getGallery";
import { fetchLatestNews } from "@/lib/payload/getNews";
import { fetchRoster } from "@/lib/payload/getRoster";
import { getTenant } from "@/lib/payload/getTenant";

export async function generateMetadata(): Promise<Metadata> {
	const tenant = await getTenant();
	return {
		title: {
			absolute: tenant.displayName,
		},
		description:
			tenant.branding?.motto ??
			`Službena web stranica nogometnog kluba ${tenant.displayName}.`,
		alternates: { canonical: "/" },
	};
}

const priceFormatter = new Intl.NumberFormat("hr-HR", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export default async function HomePage() {
	const [tenant, news, featured, albums, roster, standings, matchData] =
		await Promise.all([
			getTenant(),
			fetchLatestNews(),
			fetchFeaturedEquipment(),
			fetchAlbums(),
			fetchRoster(),
			(async () => {
				const competition = await fetchSeniorCompetition();
				if (!competition?.id) return null;
				const rows = await fetchTeamStandings({
					competitionId: competition.id,
				});
				return { competition, rows };
			})(),
			(async () => {
				try {
					const competition = await fetchSeniorCompetition();
					if (!competition?.id) return { results: [] };
					const [matches, teamIdStr] = await Promise.all([
						fetchCompetitionMatches({ competitionId: competition.id }),
						getHnsTeamId(),
					]);
					const results = getRecentForm(matches, Number(teamIdStr), 3);
					return { results };
				} catch {
					return { results: [] };
				}
			})(),
		]);

	const galleryPreview = albums.slice(0, 3);
	// Teaser momčadi — bez stožera, igrači s fotkom prvi, do 8 kartica
	const squadPreview = roster
		.filter((p) => p.position !== "trener")
		.sort((a, b) => {
			const aHasPhoto = a.photo ? 0 : 1;
			const bHasPhoto = b.photo ? 0 : 1;
			return aHasPhoto - bHasPhoto || a.displayOrder - b.displayOrder;
		})
		.slice(0, 8);
	const logoFallback =
		tenant.branding?.logo && typeof tenant.branding.logo === "object"
			? (tenant.branding.logo.url ?? "")
			: "";

	return (
		<>
			<Hero tenant={tenant} />

			<ResultsStrip results={matchData.results} />

			{news.length > 0 && (
				<Band>
					<LatestNews news={news} logoFallback={logoFallback} />
				</Band>
			)}

			{standings && standings.rows.length > 0 && (
				<Band tone="surface">
					<StandingsTable rows={standings.rows} />
				</Band>
			)}

			{squadPreview.length > 0 && (
				<Band>
					<SquadTeaser players={squadPreview} />
				</Band>
			)}

			<Band tone="yellow">
				<TeaserBand
					variant="yellow"
					eyebrow="Generacije koje dolaze"
					title="Škola nogometa"
					text="Želiš da tvoje dijete zaigra nogomet? U školi NK Vrapče vodimo najmlađe od prvih koraka s loptom do juniora. Upisi su otvoreni."
					href="/skola-nogometa"
					cta="Javi nam se"
					image="/skola-nogometa.jpg"
				/>
			</Band>

			{featured.length > 0 && (
				<Band tone="surface">
					<FeaturedShop
						items={featured.map((item) => ({
							id: item.id,
							displayName: item.displayName,
							price: `${priceFormatter.format(item.price)} €`,
							imagePath: item.imagePath,
							imageAlt: item.imageAlt,
							externalUrl: item.externalUrl,
						}))}
						webshopHref="/oprema"
					/>
				</Band>
			)}

			{galleryPreview.length > 0 && (
				<Band>
					<GalleryTeaser
						albums={galleryPreview.map((a) => ({
							id: a.id,
							title: a.title,
							href: `/galerija/${a.slug ?? a.id}`,
							cover:
								a.coverImage?.sizes?.card?.url ??
								a.coverImage?.url ??
								a.photos[0]?.image.url ??
								"",
						}))}
					/>
				</Band>
			)}

			<div className="py-16 sm:py-24">
				<LunaticsBand />
			</div>
		</>
	);
}

/**
 * Puna-širina traka za ritam homepagea. Tonovi se izmjenjuju da sekcije ne
 * plutaju u bijeloj praznini: `plain` = bijela, `surface` = svijetlo-siva
 * (lagani panel-odmak), `yellow` = žuti brand-beat. Crno (Hero/Lunatics) je
 * izvan Band-a.
 */
function Band({
	tone = "plain",
	children,
}: {
	tone?: "plain" | "surface" | "yellow";
	children: ReactNode;
}) {
	const toneClass =
		tone === "yellow"
			? "bg-brand-yellow"
			: tone === "surface"
				? "bg-surface"
				: "";
	return <div className={`py-16 sm:py-24 ${toneClass}`}>{children}</div>;
}

type NewsDoc = Awaited<ReturnType<typeof fetchLatestNews>>[number];

function newsThumb(doc: NewsDoc): string | null {
	return doc.thumbnailPath;
}

function LatestNews({
	news,
	logoFallback,
}: {
	news: NewsDoc[];
	logoFallback: string;
}) {
	const [lead, ...rest] = news;
	if (!lead) return null;
	const secondary = rest.slice(0, 3);
	const hasList = secondary.length > 0;

	return (
		<section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
			{/* Editorial header: naslov lijevo, link u istom redu desno */}
			<div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
				<div className="flex flex-col gap-3">
					<FadeInView delay={0.1}>
						<h2 className="flex items-center gap-3 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-ink sm:text-5xl">
							<span className="h-9 w-1 rounded-full bg-brand-yellow sm:h-12" />
							Vijesti
						</h2>
					</FadeInView>
				</div>
				<FadeInView delay={0.15}>
					<Link
						href="/novosti"
						className="group hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue sm:inline-flex"
					>
						Sve vijesti
						<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</FadeInView>
			</div>

			<StaggerContainer
				className="mt-12 flex flex-col gap-8 lg:gap-10"
				staggerChildren={0.08}
			>
				{/* Lead priča — široki cinematic featured s naslovom preko slike */}
				<StaggerItem>
					<Link
						href={`/novosti/${lead.slug ?? lead.id}`}
						className="group relative block aspect-[4/3] w-full overflow-hidden bg-brand-navy sm:aspect-[16/8] lg:aspect-[16/7]"
					>
						<Image
							src={newsThumb(lead) || logoFallback}
							alt={lead.title}
							fill
							priority
							sizes="(min-width: 1024px) 1152px, 100vw"
							className={`transition-transform duration-[700ms] ease-out group-hover:scale-[1.04] ${
								newsThumb(lead)
									? "object-cover"
									: "object-contain p-12 opacity-40"
							}`}
						/>
						{/* Crni gradient — isti sustav kao Hero scrim (žuta/bijela bolje iskaču) */}
						<div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
						{/* Žuti "Novo" badge — brand-pop na najnovijoj priči */}
						<span className="absolute left-6 top-6 inline-flex items-center bg-brand-yellow px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_8px_24px_-10px_rgba(255,203,5,0.9)]">
							Novo
						</span>
						<div className="absolute inset-x-0 bottom-0 flex max-w-3xl flex-col gap-3 p-6 sm:p-8 lg:p-10">
							<p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/70">
								{formatDateShort(lead.date)}
							</p>
							<h3 className="text-balance font-display text-2xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
								{lead.title}
							</h3>
							{lead.excerpt && (
								<p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-white/75">
									{lead.excerpt}
								</p>
							)}
						</div>
					</Link>
				</StaggerItem>

				{/* Sporedne priče — 3 male kartice: slika gore, tekst dolje */}
				{hasList && (
					<CardSlider itemClassName="basis-[80%] sm:basis-1/3">
						{secondary.map((doc) => (
							<Link
								key={doc.id}
								href={`/novosti/${doc.slug ?? doc.id}`}
								className="group flex h-full flex-col gap-4"
							>
								<div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
									<Image
										src={newsThumb(doc) || logoFallback}
										alt={doc.title}
										fill
										sizes="(min-width: 640px) 33vw, 100vw"
										className={`transition-transform duration-500 group-hover:scale-105 ${
											newsThumb(doc)
												? "object-cover"
												: "object-contain p-6 opacity-40"
										}`}
									/>
								</div>
								<div className="flex flex-col gap-2.5">
									<p className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
										{formatDateShort(doc.date)}
									</p>
									<h3 className="line-clamp-2 text-balance text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-brand-blue">
										{doc.title}
									</h3>
								</div>
							</Link>
						))}
					</CardSlider>
				)}
			</StaggerContainer>

			{/* Mobilni "Sve vijesti" */}
			<div className="mt-10 flex justify-center sm:hidden">
				<Link
					href="/novosti"
					className="group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue"
				>
					Sve vijesti
					<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
				</Link>
			</div>
		</section>
	);
}

function TeaserBand({
	eyebrow,
	title,
	text,
	href,
	cta,
	image,
	variant = "plain",
}: {
	eyebrow: string;
	title: string;
	text: string;
	href: string;
	cta: string;
	image: string;
	/** `yellow` = sekcija stoji na žutoj traci → akcenti se invertiraju u navy. */
	variant?: "plain" | "yellow";
}) {
	const onYellow = variant === "yellow";
	return (
		<section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
			<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
				{/* Fotografija — okvir + suptilni accent uz rub */}
				<FadeInView direction="right">
					<div
						className={`relative aspect-[4/3] w-full overflow-hidden shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] ring-1 ${onYellow ? "bg-brand-navy ring-brand-navy/15" : "bg-surface-2 ring-line"}`}
					>
						<Image
							src={image}
							alt=""
							fill
							sizes="(min-width: 1024px) 45vw, 100vw"
							className="scale-105 object-cover object-left"
						/>
						<div
							aria-hidden
							className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/55 via-black/15 to-transparent"
						/>
					</div>
				</FadeInView>

				{/* Tekst — na žutoj traci sve ide u navy (akcent, naslov, dugme) */}
				<FadeInView direction="left" delay={0.1}>
					<div className="flex flex-col items-start gap-5">
						<span
							className={`h-[3px] w-10 rounded-full ${onYellow ? "bg-brand-navy" : "bg-brand-yellow"}`}
						/>
						<p
							className={`text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:text-xs ${onYellow ? "text-brand-navy/70" : "text-brand-blue"}`}
						>
							{eyebrow}
						</p>
						<h2 className="text-balance font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-ink sm:text-4xl md:text-5xl">
							{title}
						</h2>
						<p
							className={`max-w-md text-sm leading-relaxed sm:text-base ${onYellow ? "text-brand-navy/80" : "text-muted-foreground"}`}
						>
							{text}
						</p>
						<Link
							href={href}
							className={
								onYellow
									? "group mt-2 inline-flex items-center gap-2.5 bg-brand-navy px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_14px_36px_-12px_rgba(10,28,51,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-14px_rgba(10,28,51,0.65)]"
									: "group mt-2 inline-flex items-center gap-2.5 bg-brand-yellow px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_14px_36px_-12px_rgba(255,203,5,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-14px_rgba(255,203,5,0.65)]"
							}
						>
							{cta}
							<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</div>
				</FadeInView>
			</div>
		</section>
	);
}

function FeaturedShop({
	items,
	webshopHref,
}: {
	items: {
		id: number;
		displayName: string;
		price: string;
		imagePath: string;
		imageAlt: string;
		externalUrl: string;
	}[];
	webshopHref: string;
}) {
	const visible = items.slice(0, 4);
	const itemBasis = visible.length >= 4 ? "lg:basis-1/4" : "lg:basis-1/3";

	return (
		<section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
			{/* Editorial header */}
			<div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
				<div className="flex flex-col gap-3">
					<FadeInView delay={0.1}>
						<h2 className="flex items-center gap-3 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-ink sm:text-5xl">
							<span className="h-9 w-1 rounded-full bg-brand-yellow sm:h-12" />
							Webshop
						</h2>
					</FadeInView>
				</div>
				<FadeInView delay={0.15}>
					<Link
						href={webshopHref}
						className="group hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue sm:inline-flex"
					>
						Cijela ponuda
						<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</Link>
				</FadeInView>
			</div>

			<CardSlider itemClassName={`basis-[60%] sm:basis-1/2 ${itemBasis}`}>
				{visible.map((item) => (
					<a
						key={item.id}
						href={item.externalUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="group flex h-full flex-col gap-4"
					>
						<div className="relative aspect-square w-full overflow-hidden bg-surface ring-1 ring-line">
							{item.imagePath ? (
								<Image
									src={item.imagePath}
									alt={item.imageAlt}
									fill
									sizes="(min-width: 1024px) 22vw, 45vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
							) : (
								// Branded fallback dok proizvod nema sliku
								<div className="absolute inset-0 flex items-center justify-center">
									<Image
										src="/grb-vrapce.png"
										alt=""
										width={120}
										height={120}
										className="h-2/5 w-2/5 object-contain opacity-10"
									/>
								</div>
							)}
						</div>
						<div className="flex items-end justify-between gap-3">
							<div className="flex flex-col gap-1.5">
								<span className="line-clamp-1 text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-brand-blue">
									{item.displayName}
								</span>
								<span className="font-bold tabular-nums tracking-tight text-brand-navy">
									{item.price}
								</span>
							</div>
							<ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
						</div>
					</a>
				))}
			</CardSlider>

			{/* Mobilni "Cijela ponuda" */}
			<div className="mt-10 flex justify-center sm:hidden">
				<Link
					href={webshopHref}
					className="group inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue"
				>
					Cijela ponuda
					<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
				</Link>
			</div>
		</section>
	);
}

function GalleryTeaser({
	albums,
}: {
	albums: { id: number; title: string; href: string; cover: string }[];
}) {
	return (
		<section className="relative isolate mx-auto w-full max-w-6xl px-6 sm:px-10">
			{/* Editorial header — isti sustav kao Vijesti / Momčad / Webshop */}
			<div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
				<FadeInView delay={0.1}>
					<h2 className="flex items-center gap-3 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-ink sm:text-5xl">
						<span className="h-9 w-1 rounded-full bg-brand-yellow sm:h-12" />
						Galerija
					</h2>
				</FadeInView>
				<FadeInView delay={0.15}>
					<Link
						href="/galerija"
						className="group hidden items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-brand-blue sm:inline-flex"
					>
						Sve fotografije
						<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
				</FadeInView>
			</div>
			<StaggerContainer
				className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8"
				staggerChildren={0.06}
			>
				{albums.map((album) => (
					<StaggerItem key={album.id}>
						<Link href={album.href} className="group flex flex-col gap-3">
							<div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
								{album.cover && (
									<Image
										src={album.cover}
										alt={album.title}
										fill
										sizes="(min-width: 640px) 30vw, 100vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								)}
							</div>
							<h3 className="text-balance text-base font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-brand-blue">
								{album.title}
							</h3>
						</Link>
					</StaggerItem>
				))}
			</StaggerContainer>
		</section>
	);
}

function LunaticsBand() {
	return (
		<section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
			<FadeInView>
				<Link
					href="/navijaci"
					className="group relative isolate block overflow-hidden bg-brand-navy shadow-[0_40px_100px_-50px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
				>
					{/* Baklje / ultras atmosfera — dramatična pozadina */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 -z-20"
					>
						<Image
							src="/lunatics/lunatics-baklje.webp"
							alt=""
							fill
							sizes="(min-width: 1152px) 1088px, 100vw"
							className="object-cover object-[center_60%] brightness-[0.95] transition-transform duration-700 group-hover:scale-[1.04]"
						/>
					</div>
					{/* Crni scrim drži tekst lijevo čitljivim, a desno pušta da žar baklji zasvijetli */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/20"
					/>
					{/* Suptilno tamnjenje rubova za fokus i premium dubinu */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_28%_50%,transparent_40%,rgba(0,0,0,0.6)_100%)]"
					/>

					<div className="relative flex min-h-[20rem] flex-col items-center justify-center gap-5 p-8 text-center sm:min-h-[24rem] sm:p-14 md:items-start md:p-16 md:text-left lg:min-h-[27rem] lg:p-20">
						<p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-yellow sm:text-xs">
							Bedem uz momčad · 1993
						</p>
						<h2 className="text-balance font-display text-4xl font-extrabold uppercase leading-[0.92] tracking-tight text-brand-yellow drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl lg:text-7xl">
							Lunatics Vrapče
						</h2>
						<p className="max-w-md text-balance text-sm leading-relaxed text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-base">
							Naša boja, naš ponos. Upoznaj navijačku skupinu koja diže tribine
							na svakoj utakmici.
						</p>
						<span className="mt-3 inline-flex items-center gap-2.5 bg-brand-yellow px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy shadow-[0_14px_36px_-12px_rgba(255,203,5,0.9)] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_44px_-12px_rgba(255,203,5,1)]">
							Upoznaj navijače
							<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
						</span>
					</div>
				</Link>
			</FadeInView>
		</section>
	);
}
