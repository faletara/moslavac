"use client";

import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
	AnimatedDesktopNav,
	AnimatedDesktopNavItem,
	AnimatedHamburger,
	AnimatedHeader,
	AnimatedHeaderLogo,
	AnimatedMobileNav,
	AnimatedMobileNavItem,
} from "@/components/animations";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
import type { FrontendTenant, PayloadMedia } from "@/lib/payload/types";
import NavLink from "./NavLink";

interface HeaderProps {
	tenant: FrontendTenant;
}

export default function Header({ tenant }: HeaderProps) {
	const [sheetOpen, setSheetOpen] = useState(false);

	const { data: competitions = [] } =
		api.competitions.useGetCurrentSeasonCompetitions();

	const closeSheet = () => setSheetOpen(false);

	const logo =
		tenant.branding?.logo && typeof tenant.branding.logo === "object"
			? (tenant.branding.logo as PayloadMedia)
			: null;

	return (
		<AnimatedHeader>
			<div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
				{/* Logo */}
				<AnimatedHeaderLogo>
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
				</AnimatedHeaderLogo>

				{/* Desktop nav */}
				<AnimatedDesktopNav className="hidden lg:flex lg:items-center lg:gap-10">
					<AnimatedDesktopNavItem>
						<NavLink href="/news">Vijesti</NavLink>
					</AnimatedDesktopNavItem>
					<AnimatedDesktopNavItem>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
								Sezona <ChevronDown className="size-3" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								{competitions.map((comp) => (
									<DropdownMenuItem key={comp.id} asChild>
										<Link href={`/season/${comp.id}`}>{comp.name ?? ""}</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</AnimatedDesktopNavItem>
					<AnimatedDesktopNavItem>
						<NavLink href="/matches">Utakmice</NavLink>
					</AnimatedDesktopNavItem>
					<AnimatedDesktopNavItem>
						<NavLink href="/first-team">Momčad</NavLink>
					</AnimatedDesktopNavItem>
					<AnimatedDesktopNavItem>
						<NavLink href="/klub">Klub</NavLink>
					</AnimatedDesktopNavItem>
					<AnimatedDesktopNavItem>
						<NavLink href="/oprema">Oprema</NavLink>
					</AnimatedDesktopNavItem>
				</AnimatedDesktopNav>

				{/* Mobile hamburger */}
				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="lg:hidden">
							<AnimatedHamburger open={sheetOpen}>
								<Menu className="size-5" />
							</AnimatedHamburger>
							<span className="sr-only">Otvori navigaciju</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-full max-w-md bg-background">
						<SheetHeader className="sr-only">
							<SheetTitle>Navigacija</SheetTitle>
						</SheetHeader>
						<AnimatedMobileNav
							open={sheetOpen}
							className="flex flex-col gap-6 px-8 pt-12"
						>
							<AnimatedMobileNavItem>
								<Link
									href="/news"
									onClick={closeSheet}
									className="text-3xl font-black uppercase leading-none tracking-tighter"
								>
									Vijesti
								</Link>
							</AnimatedMobileNavItem>
							<AnimatedMobileNavItem>
								<DropdownMenu>
									<DropdownMenuTrigger className="flex items-center gap-2 text-3xl font-black uppercase leading-none tracking-tighter">
										Sezona <ChevronDown className="size-6" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start">
										{competitions.map((comp) => (
											<DropdownMenuItem key={comp.id} asChild>
												<Link href={`/season/${comp.id}`} onClick={closeSheet}>
													{comp.name ?? ""}
												</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</AnimatedMobileNavItem>
							<AnimatedMobileNavItem>
								<Link
									href="/matches"
									onClick={closeSheet}
									className="text-3xl font-black uppercase leading-none tracking-tighter"
								>
									Utakmice
								</Link>
							</AnimatedMobileNavItem>
							<AnimatedMobileNavItem>
								<Link
									href="/first-team"
									onClick={closeSheet}
									className="text-3xl font-black uppercase leading-none tracking-tighter"
								>
									Momčad
								</Link>
							</AnimatedMobileNavItem>
							<AnimatedMobileNavItem>
								<Link
									href="/klub"
									onClick={closeSheet}
									className="text-3xl font-black uppercase leading-none tracking-tighter"
								>
									Klub
								</Link>
							</AnimatedMobileNavItem>
							<AnimatedMobileNavItem>
								<Link
									href="/oprema"
									onClick={closeSheet}
									className="text-3xl font-black uppercase leading-none tracking-tighter"
								>
									Oprema
								</Link>
							</AnimatedMobileNavItem>
						</AnimatedMobileNav>
					</SheetContent>
				</Sheet>
			</div>
		</AnimatedHeader>
	);
}
