import "server-only";
import { fetchClubDetails } from "@/lib/hns/team";
import { getTenant } from "@/lib/payload/getTenant";

export interface ClubStadium {
	name: string;
	address: string | null;
	place: string | null;
	mapEmbedUrl: string | null;
}

export interface ClubContact {
	address: string | null;
	place: string | null;
	email: string | null;
	phone: string | null;
	stadium: ClubStadium | null;
	mapEmbedUrl: string | null;
}

function clean(value: string | null | undefined): string | null {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
}

/** Google Maps embed iz koordinata (bez API ključa). */
function mapFromCoords(
	lat: number | null | undefined,
	lng: number | null | undefined,
): string | null {
	if (lat == null || lng == null) return null;
	return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

/**
 * Kontakt podaci kluba — HNS je primarni izvor (uvijek aktualan), a podaci iz
 * Payload tenanta služe kao nadjačavanje/fallback gdje HNS nema vrijednost.
 */
export async function getClubContact(): Promise<ClubContact> {
	const [tenant, details] = await Promise.all([getTenant(), fetchClubDetails()]);
	const c = tenant.contact;

	const facility = details?.facility;
	const stadium: ClubStadium | null = facility?.name
		? {
				name: facility.name,
				address: clean(facility.address),
				place: clean(facility.place),
				mapEmbedUrl: mapFromCoords(facility.latitude, facility.longitude),
			}
		: null;

	return {
		address: clean(c?.address) ?? clean(details?.address),
		place: clean(details?.place),
		email: clean(c?.email) ?? clean(details?.email),
		phone: clean(c?.phone) ?? clean(details?.mobilePhone),
		stadium,
		mapEmbedUrl: clean(c?.mapEmbedUrl) ?? stadium?.mapEmbedUrl ?? null,
	};
}
