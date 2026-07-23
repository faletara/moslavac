import { resolveBaseUrl } from "@/lib/helpers/siteUrl";

/** Dev port je jedino što je po klubu; ostalo razrješava platformski helper. */
export const BASE_URL = resolveBaseUrl({ devPort: 43105 });
