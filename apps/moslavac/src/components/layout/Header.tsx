"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	getCategoryChipClass,
	groupByCompetitionCategory,
	toReadableCompetitionName,
} from "@/lib/helpers/competition";
import { buildCompetitionSlug } from "@/lib/slug";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";
import type { Competition } from "@/types/hns";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";

interface HeaderProps {
	tenant: FrontendTenant;
	competitions: Competition[];
}

const dropdownContentClass =
	"min-w-72 space-y-1 rounded-none border-border/60 bg-background p-2 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.18)]";

const dropdownLabelClass = "px-2 pt-2 pb-1";

const dropdownChipClass =
	"inline-flex items-center rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em]";

const dropdownItemClass =
	"rounded-sm px-2 py-1.5 text-sm font-medium leading-snug tracking-tight text-foreground/80 transition-colors hover:text-foreground focus:bg-muted focus:text-foreground";

export default function Header({ tenant, competitions }: HeaderProps) {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [desktopSeasonOpen, setDesktopSeasonOpen] = useState(false);
	const [mobileSeasonOpen, setMobileSeasonOpen] = useState(false);
	const [hidden, setHidden] = useState(false);
	const [atTop, setAtTop] = useState(true);
	const reduced = useReducedMotion();
	const pathname = usePathname();
	// Na vrhu (ili dok je sakriven pri scrollu dolje) header nema podlogu ni
	// border, stapa se sa stranicom kao na naslovnici. Solid podloga se pojavi
	// tek kad se header VRATI niže (scroll gore, nije na vrhu), tako nema
	// bljeska podloge tijekom klizanja prema gore.
	const bare = (atTop || hidden) && !sheetOpen;
	// Stranice s tamnim hero-om ispod headera traže svijetli tekst (dark).
	// `/utakmice/...` i `/statistika/...` hvataju samo detaljne rute (ne i
	// listinge koji koriste svijetli PageHero). Drugdje je vrh svijetao pa tekst
	// ostaje taman.
	const lightText =
		bare &&
		(pathname === "/" ||
			pathname.startsWith("/utakmice/") ||
			pathname.startsWith("/statistika/") ||
			pathname.startsWith("/novosti/"));

	// Mirror open-state into a ref so the scroll listener can read it without
	// being rebound on every open/close. Radix dropdowns lock body scroll when
	// opening, which fires a synthetic scroll event; without this guard the
	// header would hide itself just as the user clicks the trigger, moving the
	// anchored menu off-screen.
	const menuOpenRef = useRef(false);
	menuOpenRef.current = sheetOpen || desktopSeasonOpen || mobileSeasonOpen;

	useEffect(() => {
		// Reloads should start at the top, not at the browser's restored scroll
		// position. Bez ovoga je na produkciji (uz Lenis) header startao u solid
		// stanju jer je atTop bio izračunat iz vraćene scroll pozicije.
		if ("scrollRestoration" in window.history) {
			window.history.scrollRestoration = "manual";
		}

		// Anchor for direction detection. Only updated once a move clears the
		// deadzone, so Lenis' sub-pixel jitter can't flip the direction frame to
		// frame (the cause of the header flicker).
		let anchorY = window.scrollY;
		let ticking = false;
		// Minimum travel before we react to a direction change.
		const DELTA = 8;

		const update = () => {
			const currentY = window.scrollY;
			setAtTop(currentY <= 80);

			if (!menuOpenRef.current) {
				if (currentY <= 80) {
					setHidden(false);
					anchorY = currentY;
				} else if (currentY > anchorY + DELTA) {
					setHidden(true);
					anchorY = currentY;
				} else if (currentY < anchorY - DELTA) {
					setHidden(false);
					anchorY = currentY;
				}
			} else {
				anchorY = currentY;
			}

			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(update);
				ticking = true;
			}
		};

		// Sync state to the real scroll position on mount; the listener alone
		// won't fire until the user scrolls, leaving the initial state stale.
		update();

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const competitionGroups = groupByCompetitionCategory(
		competitions,
		(comp) => comp.name,
	);

	const closeSheet = () => setSheetOpen(false);

	const renderCompetitionGroups = (onSelect?: () => void) =>
		competitionGroups.map((group) => {
			return (
				<div key={group.category}>
					<DropdownMenuLabel className={dropdownLabelClass}>
						<span
							className={cn(dropdownChipClass, getCategoryChipClass(group.category))}
						>
							{group.label}
						</span>
					</DropdownMenuLabel>
					{group.items.map((comp) => (
						<DropdownMenuItem
							key={comp.id}
							asChild
							className={dropdownItemClass}
						>
							<Link
								href={`/sezona/${buildCompetitionSlug(comp)}`}
								onClick={onSelect}
							>
								{toReadableCompetitionName(comp.name)}
							</Link>
						</DropdownMenuItem>
					))}
				</div>
			);
		});

	const logo =
		tenant.branding?.logo && typeof tenant.branding.logo === "object"
			? (tenant.branding.logo as PayloadMedia)
			: null;

	return (
		<header className="sticky top-0 z-50 h-20">
			{/* Animaciju skrivanja radi unutarnji sloj: sticky element NIKAD nema
			    transform jer kombinacija sticky+transform duplicira header (ghost)
			    na iOS/mobilnim browserima pri overscroll-u na vrhu stranice. */}
			<motion.div
				initial={false}
				animate={{ y: hidden ? "-100%" : "0%" }}
				transition={
					reduced
						? { duration: 0 }
						: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
				}
				className={cn(
					"h-full border-b transition-colors duration-300 will-change-transform",
					lightText && "dark",
					bare
						? "border-transparent bg-transparent"
						: "border-border/60 bg-background/90 backdrop-blur-md",
				)}
			>
			<div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
				{/* Logo */}
				<Link
					href="/"
					className="flex items-center"
					aria-label={tenant.displayName}
				>
					{logo?.url && (
						<Image
							src={logo.url}
							alt={logo.alt || tenant.displayName}
							width={56}
							height={56}
							className="rounded-full"
						/>
					)}
				</Link>

				{/* Desktop nav */}
				<nav className="hidden lg:flex lg:items-center lg:gap-10">
					<NavLink href="/novosti">Vijesti</NavLink>
					<DropdownMenu
						modal={false}
						open={desktopSeasonOpen}
						onOpenChange={setDesktopSeasonOpen}
					>
						<DropdownMenuTrigger className="flex cursor-pointer items-center gap-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
							Sezona <ChevronDown className="size-3" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							sideOffset={20}
							className={dropdownContentClass}
						>
							{renderCompetitionGroups()}
						</DropdownMenuContent>
					</DropdownMenu>
					<NavLink href="/utakmice">Utakmice</NavLink>
					<NavLink href="/prva-momcad">Momčad</NavLink>
					<NavLink href="/klub">Klub</NavLink>
					<NavLink href="/oprema">Oprema</NavLink>
				</nav>

				{/* Mobile: hamburger */}
				<div className="flex items-center gap-1 lg:hidden">
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>
						<button
							type="button"
							aria-label="Otvori navigaciju"
							className={cn(
								"inline-flex size-10 items-center justify-center rounded-md transition-colors lg:hidden",
								lightText
									? "text-white hover:bg-white/10"
									: "text-foreground hover:bg-foreground/5",
							)}
						>
							<Menu className="size-6" />
							<span className="sr-only">Otvori navigaciju</span>
						</button>
					</SheetTrigger>
					<SheetContent side="right" className="w-full max-w-md bg-background">
						<SheetHeader className="sr-only">
							<SheetTitle>Navigacija</SheetTitle>
						</SheetHeader>
						<nav className="flex flex-col gap-6 px-8 pt-12">
							<Link
								href="/novosti"
								onClick={closeSheet}
								className="text-3xl font-black uppercase leading-none tracking-tighter"
							>
								Vijesti
							</Link>
							<DropdownMenu
								modal={false}
								open={mobileSeasonOpen}
								onOpenChange={setMobileSeasonOpen}
							>
								<DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 text-3xl font-black uppercase leading-none tracking-tighter">
									Sezona <ChevronDown className="size-6" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className={dropdownContentClass}
								>
									{renderCompetitionGroups(closeSheet)}
								</DropdownMenuContent>
							</DropdownMenu>
							<Link
								href="/utakmice"
								onClick={closeSheet}
								className="text-3xl font-black uppercase leading-none tracking-tighter"
							>
								Utakmice
							</Link>
							<Link
								href="/prva-momcad"
								onClick={closeSheet}
								className="text-3xl font-black uppercase leading-none tracking-tighter"
							>
								Momčad
							</Link>
							<Link
								href="/klub"
								onClick={closeSheet}
								className="text-3xl font-black uppercase leading-none tracking-tighter"
							>
								Klub
							</Link>
							<Link
								href="/oprema"
								onClick={closeSheet}
								className="text-3xl font-black uppercase leading-none tracking-tighter"
							>
								Oprema
							</Link>
						</nav>
					</SheetContent>
				</Sheet>
				</div>
			</div>
			</motion.div>
		</header>
	);
}
