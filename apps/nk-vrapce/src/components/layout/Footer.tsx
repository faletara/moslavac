import { Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import type { FrontendTenant } from "@/lib/payload/types";

export default function Footer({ tenant }: { tenant: FrontendTenant }) {
	const year = new Date().getFullYear();
	const { displayName, branding, contact, social } = tenant;

	const hasContact = Boolean(
		contact?.address || contact?.email || contact?.phone,
	);
	const hasSocial = Boolean(
		social?.facebook || social?.youtube || social?.webshop,
	);

	return (
		<footer className="relative isolate overflow-hidden bg-black text-white">
			{/* Žuti accent na vrhu — brand-rub koji odvaja footer od stranice */}
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-yellow/40 to-transparent"
			/>

			{/* Landmark — bolnica Vrapče kao suptilni brand watermark koji izranja s dna */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
			>
				<Image
					src="/bolnica-transparent.png"
					alt=""
					fill
					sizes="100vw"
					className="object-cover object-[center_75%]"
				/>
			</div>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-transparent via-black/50 to-black"
			/>

			<div className="relative mx-auto max-w-6xl px-4 py-16">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					{/* Klub */}
					<div className="flex flex-col gap-4">
						<div className="flex items-center gap-3">
							<Image
								src="/grb-vrapce.png"
								alt={displayName}
								width={128}
								height={128}
								quality={90}
								className="h-12 w-12 object-contain"
							/>
							<span className="font-display text-lg font-extrabold tracking-tight uppercase">
								{displayName}
							</span>
						</div>
						<p className="max-w-xs text-sm leading-relaxed text-white/60">
							{branding?.motto ?? "Ponos i tradicija našeg kluba."}
						</p>
					</div>

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

					{/* Linkovi */}
					<div>
						<h3 className="mb-4 text-xs font-semibold tracking-widest text-brand-yellow uppercase">
							Linkovi
						</h3>
						<ul className="space-y-3 text-sm text-white/80">
							{[
								{ href: "/klub", label: "Klub" },
								{ href: "/novosti", label: "Novosti" },
								{ href: "/utakmice", label: "Utakmice" },
								{
									href: "/politika-privatnosti",
									label: "Politika privatnosti",
								},
								{ href: "/pravna-napomena", label: "Pravna napomena" },
							].map((link) => (
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
