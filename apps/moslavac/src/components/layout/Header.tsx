"use client";

import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { api } from "@/lib/api";
import {
	getCategoryChipClass,
	groupByCompetitionCategory,
	toReadableCompetitionName,
} from "@/lib/helpers/competition";
import { buildCompetitionSlug } from "@/lib/slug";
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";
import { cn } from "@/lib/utils";
import NavLink from "./NavLink";

interface HeaderProps {
	tenant: FrontendTenant;
}

const dropdownContentClass =
	"min-w-72 space-y-1 rounded-none border-border/60 bg-background p-2 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.18)]";

const dropdownLabelClass = "px-2 pt-2 pb-1";

const dropdownChipClass =
	"inline-flex items-center rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em]";

const dropdownItemClass =
	"rounded-sm px-2 py-1.5 text-sm font-medium leading-snug tracking-tight text-foreground/80 transition-colors hover:text-foreground focus:bg-muted focus:text-foreground";

export default function Header({ tenant }: HeaderProps) {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [desktopSeasonOpen, setDesktopSeasonOpen] = useState(false);
	const [mobileSeasonOpen, setMobileSeasonOpen] = useState(false);
	const [hidden, setHidden] = useState(false);

	// Mirror open-state into a ref so the scroll listener can read it without
	// being rebound on every open/close. Radix dropdowns lock body scroll when
	// opening, which fires a synthetic scroll event — without this guard the
	// header would hide itself just as the user clicks the trigger, moving the
	// anchored menu off-screen.
	const menuOpenRef = useRef(false);
	menuOpenRef.current = sheetOpen || desktopSeasonOpen || mobileSeasonOpen;

	useEffect(() => {
		let lastY = window.scrollY;
		let ticking = false;

		const update = () => {
			const currentY = window.scrollY;

			if (!menuOpenRef.current) {
				if (currentY <= 80) {
					setHidden(false);
				} else if (currentY > lastY) {
					setHidden(true);
				} else if (currentY < lastY) {
					setHidden(false);
				}
			}

			lastY = currentY;
			ticking = false;
		};

		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(update);
				ticking = true;
			}
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const { data: competitions = [] } =
		api.competitions.useGetCurrentSeasonCompetitions();

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
		<header
			className={cn(
				"sticky top-0 z-50 h-20 border-b border-border/60 bg-background transition-transform duration-300 will-change-transform",
				hidden && "-translate-y-full",
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

				{/* Mobile hamburger */}
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="lg:hidden">
							<Menu className="size-5" />
							<span className="sr-only">Otvori navigaciju</span>
						</Button>
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
		</header>
	);
}
