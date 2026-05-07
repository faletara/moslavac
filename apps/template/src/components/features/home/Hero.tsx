import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FrontendTenant } from "@/lib/payload/types";

type HeroProps = {
	tenant: FrontendTenant;
};

export default function Hero({ tenant }: HeroProps) {
	const founded = tenant.branding?.founded ?? null;
	const motto =
		tenant.branding?.motto ??
		"Više od devet desetljeća popovačkog nogometa. Strast, ponos i klub koji pišemo zajedno.";
	const nameParts = splitDisplayName(tenant.displayName);
	const taglinePrefix = founded ? `Osnovan ${founded}` : tenant.displayName;

	return (
		<section className="relative isolate flex min-h-svh w-full flex-col overflow-hidden md:min-h-screen md:items-center md:justify-center md:py-24">
			<div className="absolute inset-0 -z-20 opacity-[0.06]">
				<Image
					src="/naslovna.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover grayscale"
				/>
			</div>

			{founded && (
				<span
					aria-hidden
					className="pointer-events-none absolute -bottom-6 right-2 -z-10 select-none font-black leading-none tracking-tighter text-foreground/5 text-[42vw] md:-bottom-12 md:right-6 md:text-[26vw]"
				>
					{founded}
				</span>
			)}

			<div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-16 sm:px-10 md:max-w-6xl md:flex-none md:items-center md:px-6 md:py-0 md:text-center">
				<div className="flex flex-col items-start gap-4 md:items-center">
					<span className="h-px w-12 bg-foreground" />
					<div className="flex items-center gap-3">
						<Image
							src="/grb.png"
							alt=""
							width={36}
							height={36}
							priority
							className="h-9 w-9 md:h-10 md:w-10"
						/>
						<p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
							{taglinePrefix}
						</p>
					</div>
				</div>

				<h1
					aria-label={tenant.displayName}
					className="mt-10 select-none text-balance font-black uppercase leading-[0.85] tracking-tighter md:mt-12"
				>
					{nameParts.map((part, idx) => (
						<span
							key={`${part}-${idx}`}
							className="block text-[15vw] md:text-[14vw]"
						>
							{part}
						</span>
					))}
				</h1>

				<p className="mt-8 max-w-md text-balance text-sm leading-relaxed text-muted-foreground md:mx-auto md:mt-10 md:max-w-xl md:text-center md:text-base">
					{motto}
				</p>

				<div className="mt-10 md:mt-12">
					<Link
						href="#sljedeca-utakmica"
						className="group inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-foreground transition-colors hover:text-muted-foreground"
					>
						Saznaj više
						<ArrowDown className="size-3 transition-transform duration-300 group-hover:translate-y-1" />
					</Link>
				</div>
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
