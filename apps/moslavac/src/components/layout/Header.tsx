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
		<header className="sticky top-0 z-50 h-20 border-b border-border/60 bg-background">
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
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
							Sezona <ChevronDown className="size-3" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{competitions.map((comp) => (
								<DropdownMenuItem key={comp.id} asChild>
									<Link href={`/sezona/${comp.id}`}>{comp.name ?? ""}</Link>
								</DropdownMenuItem>
							))}
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
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-2 text-3xl font-black uppercase leading-none tracking-tighter">
									Sezona <ChevronDown className="size-6" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									{competitions.map((comp) => (
										<DropdownMenuItem key={comp.id} asChild>
											<Link href={`/sezona/${comp.id}`} onClick={closeSheet}>
												{comp.name ?? ""}
											</Link>
										</DropdownMenuItem>
									))}
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
