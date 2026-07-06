import { fetchFeaturedEquipment } from "@/lib/payload/getEquipment";
import WebShopView from "./WebShopView";

export default async function WebShopCarousel() {
	const items = await fetchFeaturedEquipment();

	if (items.length === 0) return null;

	return <WebShopView items={items} />;
}
