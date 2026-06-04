import "server-only";
import { getTenant } from "../payload/getTenant";

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
	const tenant = await getTenant();
	const url = `${HNS_API_BASE}${endpoint}`;

	const response = await fetch(url, {
		headers: {
			API_KEY: tenant.hns.apiKey,
			"Accept-Language": "hr",
			Accept: "application/json",
		},
		next: { revalidate, tags },
	});

	if (!response.ok) {
		console.error(
			`HNS fetch failed (${response.status} ${response.statusText}): ${endpoint}`,
		);
		return null;
	}

	return response.json() as Promise<T>;
}

export async function getHnsTeamId(): Promise<string> {
	const tenant = await getTenant();
	return tenant.hns.teamId;
}

export async function getSeniorCompetitionFilter(): Promise<string | null> {
	const tenant = await getTenant();
	return tenant.hns.seniorCompetitionFilter ?? null;
}

export function currentSeasonTag(): string {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth() + 1;
	const startYear = month >= 8 ? year : year - 1;
	const pad = (n: number) => String(n % 100).padStart(2, "0");
	return `${pad(startYear)}/${pad(startYear + 1)}`;
}
