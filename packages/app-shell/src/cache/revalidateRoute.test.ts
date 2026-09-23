import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type RevalidateCache, createRevalidateRoute } from "./revalidateRoute";

/**
 * Tajne klubova uz glavnu tajnu CMS-a `dummy-master`, izračunate izvan koda:
 * `printf %s club-a | openssl dgst -sha256 -hmac dummy-master` (i `club-b`).
 */
const CLUB_A_SECRET =
  "a7b646824599f1f14793c8deb7546f1f4086e6789b1f3fbe8024722ae6cd0897";

const CLUB_B_SECRET =
  "293e4c05963796b2fb66c16e10ca8ecd02b97e7713952efa8ed8d821f0aa6a20";

let revalidatedTags: string[] = [];

let revalidatedPaths: string[] = [];

const cache: RevalidateCache = {
  revalidateTag: (tag) => {
    revalidatedTags.push(tag);
  },
  revalidatePath: (path) => {
    revalidatedPaths.push(path);
  },
};

/** Ruta kluba B: njegov env drži samo njegovu tajnu. */
const clubBRoute = createRevalidateRoute(cache);

const post = (authorization: string | null) =>
  clubBRoute(
    new Request("https://club-b.example/api/revalidate", {
      method: "POST",
      headers: authorization ? { authorization } : undefined,
      body: JSON.stringify({ tags: ["news-club-b"] }),
    }),
  );

beforeEach(() => {
  revalidatedTags = [];
  revalidatedPaths = [];
  vi.stubEnv("REVALIDATE_SECRET", CLUB_B_SECRET);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createRevalidateRoute", () => {
  it("revalidates the club's tags with the club's own credential", async () => {
    const response = await post(`Bearer ${CLUB_B_SECRET}`);

    expect(response.status).toBe(200);
    expect(revalidatedTags).toEqual(["news-club-b"]);
    expect(revalidatedPaths).toEqual(["/"]);
  });

  it("rejects the credential issued to another club", async () => {
    const response = await post(`Bearer ${CLUB_A_SECRET}`);

    expect(response.status).toBe(401);
    expect(revalidatedTags).toEqual([]);
  });

  it.each([
    ["no header", null],
    ["a shorter token", `Bearer ${CLUB_B_SECRET.slice(0, 10)}`],
    ["a token without the scheme", CLUB_B_SECRET],
  ])("rejects %s", async (_case, authorization) => {
    const response = await post(authorization);

    expect(response.status).toBe(401);
    expect(revalidatedTags).toEqual([]);
  });

  it("also accepts the previous shared secret while it is set for the rollout", async () => {
    vi.stubEnv("REVALIDATE_SECRET_PREVIOUS", "dummy-old-shared");

    expect((await post(`Bearer ${CLUB_B_SECRET}`)).status).toBe(200);
    expect((await post("Bearer dummy-old-shared")).status).toBe(200);
    expect((await post(`Bearer ${CLUB_A_SECRET}`)).status).toBe(401);
  });

  it("rejects the previous shared secret once it is removed", async () => {
    vi.stubEnv("REVALIDATE_SECRET_PREVIOUS", "");

    expect((await post("Bearer dummy-old-shared")).status).toBe(401);
    expect((await post("Bearer ")).status).toBe(401);
  });

  it("stays closed when the club has no secret configured", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "");

    const response = await post("Bearer ");

    expect(response.status).toBe(401);
  });
});
