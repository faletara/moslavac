"use client";

import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

const dropdownContentClass = "min-w-72 space-y-1 p-2";

const dropdownLabelClass = "px-2 pt-2 pb-1";

const dropdownChipClass = "inline-flex items-center px-2 py-0.5";

const dropdownItemClass = "px-2 py-1.5";

export default function Header({ tenant }: HeaderProps) {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [desktopSeasonOpen, setDesktopSeasonOpen] = useState(false);
	const [mobileSeasonOpen, setMobileSeasonOpen] = useState(false);

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
		<header className="sticky top-0 z-50 h-20">
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
						<DropdownMenuTrigger className="flex cursor-pointer items-center gap-1">
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
					<SheetContent side="right" className="w-full max-w-md">
						<SheetHeader className="sr-only">
							<SheetTitle>Navigacija</SheetTitle>
						</SheetHeader>
						<nav className="flex flex-col gap-6 px-8 pt-12">
							<Link href="/novosti" onClick={closeSheet}>
								Vijesti
							</Link>
							<DropdownMenu
								modal={false}
								open={mobileSeasonOpen}
								onOpenChange={setMobileSeasonOpen}
							>
								<DropdownMenuTrigger className="flex cursor-pointer items-center gap-2">
									Sezona <ChevronDown className="size-6" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className={dropdownContentClass}
								>
									{renderCompetitionGroups(closeSheet)}
								</DropdownMenuContent>
							</DropdownMenu>
							<Link href="/utakmice" onClick={closeSheet}>
								Utakmice
							</Link>
							<Link href="/prva-momcad" onClick={closeSheet}>
								Momčad
							</Link>
							<Link href="/klub" onClick={closeSheet}>
								Klub
							</Link>
							<Link href="/oprema" onClick={closeSheet}>
								Oprema
							</Link>
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
