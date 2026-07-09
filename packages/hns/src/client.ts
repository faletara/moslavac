import "server-only";
import { getTenant } from "@/lib/payload/getTenant";
import { getActiveHnsContext } from "./context";
import type { HnsTransport } from "./context";

const HNS_API_BASE =
	process.env.HNS_API_BASE ?? "https://api-hns.analyticom.de";

/** Default production transport: the real HTTP call to the HNS API. */
export const httpTransport: HnsTransport = async (
	endpoint,
	{ revalidate, tags } = {},
) => {
	const ctx = getActiveHnsContext();
	const apiKey = ctx ? ctx.apiKey : (await getTenant()).hns.apiKey;
	const url = `${HNS_API_BASE}${endpoint}`;

	const init: RequestInit & { dispatcher?: unknown; next?: unknown } = {
		headers: {
			API_KEY: apiKey,
			"Accept-Language": "hr",
			Accept: "application/json",
		},
	};

	if (ctx) {
		// Explicit-context callers (the CMS cron) want fresh data, have no
		// per-request Next cache to tag, and may need a custom DNS dispatcher.
		init.cache = "no-store";
		if (ctx.dispatcher) init.dispatcher = ctx.dispatcher;
	} else {
		init.next = { revalidate, tags };
	}

	const response = await fetch(url, init);

	if (!response.ok) {
		throw new Error(
			`HNS fetch failed (${response.status} ${response.statusText}): ${endpoint}`,
		);
	}

	return response.json();
};

/** The transport in effect: an injected one (tests / CMS cron) or the HTTP default. */
export function resolveTransport(): HnsTransport {
	return getActiveHnsContext()?.transport ?? httpTransport;
}

export async function getHnsTeamId(): Promise<string> {
	const ctx = getActiveHnsContext();
	if (ctx) return ctx.teamId;
	return (await getTenant()).hns.teamId;
}

export async function getSeniorCompetitionFilter(): Promise<string | null> {
	const ctx = getActiveHnsContext();
	if (ctx) return ctx.seniorCompetitionFilter ?? null;
	return (await getTenant()).hns.seniorCompetitionFilter ?? null;
}

export function currentSeasonTag(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const startYear = month >= 8 ? year : year - 1;
	const pad = (n: number) => String(n % 100).padStart(2, "0");
	return `${pad(startYear)}/${pad(startYear + 1)}`;
}
