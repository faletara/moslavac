import "server-only";
import webpush from "web-push";

// One platform-wide VAPID keypair (not per-tenant): the public key ships to
// every club's frontend, the private key lives only on the CMS deploy.
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? "mailto:info@moslavac.hr";

let configured = false;

/** Configure web-push lazily; returns false when keys are missing. */
export function ensureVapidConfigured(): boolean {
  if (configured) return true;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  configured = true;
  return true;
}

export { webpush };
