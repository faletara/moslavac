import "server-only";
import { getHnsTeamId, hnsFetch } from "./client";
import { tenantSlug } from "../payload/getTenant";

interface HnsPicture {
  uuid: string;
  value: string | null;
}

export async function fetchHnsImageBytes(uuid: string): Promise<Buffer | null> {
  const teamId = await getHnsTeamId();
  const result = await hnsFetch<HnsPicture>(
    `/api/live/images/${uuid}?teamIdFilter=${teamId}`,
    {
      revalidate: 86_400,
      tags: [`hns-${tenantSlug}-image-${uuid}`],
    },
  );
  if (!result?.value) return null;
  return Buffer.from(result.value, "base64");
}
