import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SeasonTicketPromoSection() {
	return (
		<section className="w-full overflow-x-clip px-4 py-16 sm:py-24">
			<div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
				<div>
					<Image
						src="/fans.jpg"
						alt="Navijači"
						sizes="(min-width: 768px) 50vw, 100vw"
						width={800}
						height={600}
						className="aspect-4/3 w-full md:aspect-square object-cover"
					/>
				</div>

				<div className="flex flex-col items-start gap-8">
					<div className="flex flex-col items-start gap-4">
						<p>Sezonska iskaznica</p>
					</div>

					<h2>
						Postani naš 12. igrač
					</h2>

					<p className="max-w-md">
						Osiguraj svoje mjesto na tribinama i podržavaj svoj klub tijekom
						cijele sezone.
					</p>

					<Link
						href="/sezonska-iskaznica"
						className="inline-flex items-center gap-3"
					>
						Kupi iskaznicu
						<ArrowRight className="size-3" />
					</Link>
				</div>
			</div>
		</section>
	);
}
