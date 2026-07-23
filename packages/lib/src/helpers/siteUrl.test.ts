import { afterEach, describe, expect, it } from "vitest";
import { resolveBaseUrl } from "./siteUrl";

const ENV_KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL"];

afterEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});

describe("resolveBaseUrl", () => {
  it("koristi klupski dev port kada nijedna env varijabla nije postavljena", () => {
    expect(resolveBaseUrl({ devPort: 43105 })).toBe("http://localhost:43105");
  });

  it("eksplicitni NEXT_PUBLIC_SITE_URL ima prednost pred Vercel domenom", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://klub.hr";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "klub.vercel.app";
    expect(resolveBaseUrl({ devPort: 43105 })).toBe("https://klub.hr");
  });

  it("pada na Vercel produkcijsku domenu kada nema eksplicitnog URL-a", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "klub.vercel.app";
    expect(resolveBaseUrl({ devPort: 43105 })).toBe("https://klub.vercel.app");
  });

  it("uklanja završnu kosu crtu da ne nastane dvostruka u sitemapu", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://klub.hr/";
    expect(resolveBaseUrl({ devPort: 43105 })).toBe("https://klub.hr");

    process.env.NEXT_PUBLIC_SITE_URL = "https://klub.hr///";
    expect(resolveBaseUrl({ devPort: 43105 })).toBe("https://klub.hr");
  });
});
