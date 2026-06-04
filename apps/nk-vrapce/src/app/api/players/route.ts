export async function GET() {
  // Players are sourced exclusively from HNS API now (no local Payload Players collection).
  // first-team page should be refactored to fetch HNS team players directly.
  return Response.json([]);
}
