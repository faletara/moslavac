import { serviceWorkerSource } from "@/lib/pwa/serviceWorkerSource";

// Serve the shared hand-rolled service worker at /sw.js with the headers it
// needs to control the whole origin.
export async function GET() {
  return new Response(serviceWorkerSource, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
