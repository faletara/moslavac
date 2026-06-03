"use client";

import { ArrowDown } from "lucide-react";
import Image from "next/image";
import type { FrontendTenant } from "@/lib/payload/types";

type HeroProps = {
	tenant: FrontendTenant;
};

export default function Hero({ tenant }: HeroProps) {
	const founded = tenant.branding?.founded ?? null;
	const nameParts = splitDisplayName(tenant.displayName);
	const taglinePrefix = founded ? `Osnovan ${founded}` : tenant.displayName;

	return (
		<section className="relative isolate flex min-h-[calc(100svh-7rem)] w-full flex-col items-center justify-center overflow-hidden md:min-h-[calc(100vh-7rem)] md:py-24">
			{/* Background image */}
			<div className="absolute inset-0 -z-20">
				<Image
					src="/naslovna.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover"
				/>
			</div>

			{/* Founded year watermark */}
			{founded && (
				<div
					aria-hidden
					className="pointer-events-none absolute -bottom-6 right-2 -z-10 select-none md:-bottom-12 md:right-6"
				>
					<span className="block">
						{founded}
					</span>
				</div>
			)}

			<div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10 md:max-w-6xl md:flex-none md:px-6 md:py-0">
				<div className="flex flex-col items-center gap-4">
					{/* Decorative line */}
					<span />

					{/* Grb + tagline */}
					<div className="flex items-center gap-3">
						<Image
							src="/grb.png"
							alt=""
							width={36}
							height={36}
							priority
							className="h-9 w-9 md:h-10 md:w-10"
						/>
						<p>{taglinePrefix}</p>
					</div>
				</div>

				{/* Main heading */}
				<h1 aria-label={tenant.displayName} className="mt-10 select-none md:mt-12">
					{nameParts.map((part) => (
						<span key={part} className="block overflow-hidden">
							<span className="block">
								{part}
							</span>
						</span>
					))}
				</h1>
			</div>

			{/* Scroll indicator */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 md:bottom-10"
			>
				<span>Istraži</span>
				<span>
					<ArrowDown className="h-4 w-4" strokeWidth={1.5} />
				</span>
			</div>
		</section>
	);
}

function splitDisplayName(displayName: string): string[] {
	const trimmed = displayName.trim();
	if (!trimmed) return [displayName];
	const parts = trimmed.split(/\s+/);
	if (parts.length <= 1) return parts;
	const [first, ...rest] = parts;
	return first ? [first, rest.join(" ")] : parts;
}
