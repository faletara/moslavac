"use client";

import { type CountdownState, useCountdown } from "@/lib/helpers/countdown";
import {
	type PluralForms,
	TIME_UNIT_FORMS,
	pluralForm,
} from "@/lib/helpers/plural";

const TILES = [
	{ key: "days", forms: TIME_UNIT_FORMS.day },
	{ key: "hours", forms: TIME_UNIT_FORMS.hour },
	{ key: "minutes", forms: TIME_UNIT_FORMS.minute },
	{ key: "seconds", forms: TIME_UNIT_FORMS.second },
] satisfies { key: keyof CountdownState; forms: PluralForms }[];

/**
 * Odbrojavanje do prve lopte, na navy traci kartice. Bez okvira — brojevi su
 * odvojeni tankim linijama, sekunde su žute da se vidi da je brojka živa.
 * Do prvog ticka renderira crtice (hydration-safe), na kraju staje na nuli.
 */
export function Countdown({ target }: { target: number }) {
	const state = useCountdown(target);

	return (
		<div
			className="flex divide-x divide-white/10"
			// Odbrojavanje se mijenja svake sekunde — čitač neka ga pročita tek
			// kad ga korisnik sam potraži, ne na svaki tick.
			aria-label="Vrijeme do početka utakmice"
		>
			{TILES.map(({ key, forms }, i) => {
				const value = state ? String(state[key]).padStart(2, "0") : "––";
				const isSeconds = key === "seconds";

				return (
					<div
						key={key}
						className={`flex flex-col items-center gap-2 px-4 first:pl-0 sm:px-6 ${
							// Sekunde su na mobitelu šum — sekcija je ionako uža.
							isSeconds ? "hidden sm:flex" : ""
						} ${i === 0 ? "pl-0" : ""}`}
					>
						<span
							className={`font-display text-4xl font-extrabold leading-none tabular-nums sm:text-5xl ${
								isSeconds ? "text-brand-yellow" : "text-white"
							}`}
						>
							{value}
						</span>
						<span className="text-[0.5rem] font-bold uppercase tracking-[0.25em] text-white/40">
							{pluralForm(state ? state[key] : 0, forms)}
						</span>
					</div>
				);
			})}
		</div>
	);
}
