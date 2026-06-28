import "server-only";
import { getTenant } from "@/lib/payload/getTenant";
import { getActiveHnsContext } from "./context";

const HNS_API_BASE =
	process.env.HNS_API_BASE ?? "https://api-hns.analyticom.de";

interface HnsFetchOptions {
	revalidate?: number;
	tags?: string[];
}

export async function hnsFetch<T>(
	endpoint: string,
	{ revalidate, tags }: HnsFetchOptions = {},
): Promise<T | null> {
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
		console.error(
			`HNS fetch failed (${response.status} ${response.statusText}): ${endpoint}`,
		);
		return null;
	}

	return response.json() as Promise<T>;
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
