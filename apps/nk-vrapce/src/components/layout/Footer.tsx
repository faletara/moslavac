import { Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import type { ClubContact } from "@/lib/club/getClubContact";
import type { FrontendTenant } from "@/lib/payload/types";

// Sitemap kolone — odražavaju Header navigaciju (prave rute)
const LINK_GROUPS: { title: string; links: { href: string; label: string }[] }[] =
	[
		{
			title: "Klub",
			links: [
				{ href: "/novosti", label: "Vijesti" },
				{ href: "/povijest", label: "Povijest" },
				{ href: "/uprava", label: "Uprava" },
				{ href: "/statut", label: "Statut" },
				{ href: "/navijaci", label: "Lunatics" },
			],
		},
		{
			title: "Momčad",
			links: [
				{ href: "/seniori", label: "Seniori" },
				{ href: "/skola-nogometa", label: "Škola nogometa" },
			],
		},
		{
			title: "Više",
			links: [
				{ href: "/galerija", label: "Galerija" },
				{ href: "/oprema", label: "Webshop" },
				{ href: "/kontakt", label: "Kontakt" },
			],
		},
	];

export default function Footer({
	tenant,
	contact,
}: {
	tenant: FrontendTenant;
	contact: ClubContact;
}) {
	const year = new Date().getFullYear();
	const { displayName, branding, social } = tenant;

	const hasContact = Boolean(
		contact.address || contact.email || contact.phone,
	);
	const hasSocial = Boolean(
		social?.facebook || social?.youtube || social?.webshop,
	);

	return (
		<footer className="relative isolate overflow-hidden bg-brand-navy text-white">
			{/* Žuti accent na vrhu — brand-rub koji odvaja footer od stranice */}
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-yellow/40 to-transparent"
			/>

			{/* Veliki brand wordmark — izranja s dna, daje footeru karakter */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 flex justify-center overflow-hidden"
			>
				<span className="translate-y-[28%] bg-gradient-to-b from-white/[0.07] to-transparent bg-clip-text font-display text-[22vw] leading-none font-extrabold tracking-tighter whitespace-nowrap text-transparent uppercase select-none lg:text-[18vw]">
					{displayName}
				</span>
			</div>

			<div className="relative mx-auto max-w-6xl px-4 pt-16 pb-40">
				<div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
					{/* Klub */}
					<div className="flex max-w-xs flex-col gap-4">
						<div className="flex items-center gap-3">
							<Image
								src="/grb-vrapce.png"
								alt={displayName}
								width={128}
								height={128}
								quality={90}
								className="h-14 w-14 object-contain"
							/>
							<span className="font-display text-2xl font-extrabold tracking-tight uppercase">
								{displayName}
							</span>
						</div>
						<p className="text-sm leading-relaxed text-white/60">
							{branding?.motto ?? "Ponos i tradicija našeg kluba."}
						</p>
					</div>

					<div className="flex flex-wrap gap-x-16 gap-y-10">
					{/* Kontakt */}
					{hasContact ? (
						<div>
							<h3 className="mb-4 text-xs font-semibold tracking-widest text-brand-yellow uppercase">
								Kontakt
							</h3>
							<ul className="space-y-3 text-sm text-white/80">
								{contact?.address ? (
									<li className="flex items-start gap-2.5">
										<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
										<span>{contact.address}</span>
									</li>
								) : null}
								{contact?.email ? (
									<li className="flex items-center gap-2.5">
										<Mail className="h-4 w-4 shrink-0 text-brand-blue" />
										<a
											href={`mailto:${contact.email}`}
											className="transition-colors hover:text-brand-yellow"
										>
											{contact.email}
										</a>
									</li>
								) : null}
								{contact?.phone ? (
									<li className="flex items-center gap-2.5">
										<Phone className="h-4 w-4 shrink-0 text-brand-blue" />
										<a
											href={`tel:${contact.phone}`}
											className="transition-colors hover:text-brand-yellow"
										>
											{contact.phone}
										</a>
									</li>
								) : null}
							</ul>
						</div>
					) : null}

					{/* Sitemap kolone */}
					{LINK_GROUPS.map((group) => (
						<div key={group.title}>
							<h3 className="mb-4 text-xs font-semibold tracking-widest text-brand-yellow uppercase">
								{group.title}
							</h3>
							<ul className="space-y-3 text-sm text-white/80">
								{group.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="transition-colors hover:text-brand-yellow"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					{/* Pratite nas */}
					{hasSocial ? (
						<div>
							<h3 className="mb-4 text-xs font-semibold tracking-widest text-brand-yellow uppercase">
								Pratite nas
							</h3>
							<div className="flex gap-3">
								{social?.facebook ? (
									<a
										href={social.facebook}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Facebook"
										className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-blue"
									>
										<FaFacebook className="h-5 w-5" />
									</a>
								) : null}
								{social?.youtube ? (
									<a
										href={social.youtube}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="YouTube"
										className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-blue"
									>
										<FaYoutube className="h-5 w-5" />
									</a>
								) : null}
								{social?.webshop ? (
									<a
										href={social.webshop}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Web shop"
										className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-blue"
									>
										<ShoppingBag className="h-5 w-5" />
									</a>
								) : null}
							</div>
						</div>
					) : null}
					</div>
				</div>

				<div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
					<span>
						© {year} {displayName}. Sva prava pridržana.
					</span>
					<span>Službena web stranica kluba.</span>
				</div>
			</div>
		</footer>
	);
}
