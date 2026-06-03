import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ComeToMatchSection() {
	return (
		<section className="relative isolate w-full overflow-hidden">
			<Image
				src="/game.jpg"
				alt="Utakmica"
				fill
				sizes="100vw"
				className="absolute inset-0 -z-20 object-cover"
			/>
			<div className="absolute inset-0 -z-10" />

			<div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-24 sm:py-32 md:px-6">
				<div className="flex flex-col items-start gap-4">
					<p>Podrži svoj klub</p>
				</div>

				<h2>Dođi na utakmicu</h2>

				<p className="max-w-md">
					Atmosfera, navijači i naša momčad — uživo na stadionu. Vidimo se na
					tribinama.
				</p>

				<Link href="/utakmice" className="inline-flex items-center gap-3">
					Pogledaj raspored
					<ArrowRight className="size-3" />
				</Link>
			</div>
		</section>
	);
}
