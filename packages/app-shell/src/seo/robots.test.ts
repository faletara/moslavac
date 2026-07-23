import { describe, expect, it } from "vitest";
import { buildRobots } from "./robots";

const baseUrl = "https://klub.example";

const ruleFor = (agent: string) => {
  const rules = buildRobots({ baseUrl }).rules;
  const list = Array.isArray(rules) ? rules : [rules];
  return list.find((rule) => {
    const agents = Array.isArray(rule.userAgent)
      ? rule.userAgent
      : [rule.userAgent];
    return agents.includes(agent);
  });
};

describe("buildRobots", () => {
  it("upućuje robote na sitemap kluba", () => {
    expect(buildRobots({ baseUrl }).sitemap).toBe(`${baseUrl}/sitemap.xml`);
  });

  it("podnosi bazni URL sa završnom kosom crtom", () => {
    expect(buildRobots({ baseUrl: `${baseUrl}/` }).sitemap).toBe(
      `${baseUrl}/sitemap.xml`,
    );
  });

  it("otvara stranicu svim robotima, ali zatvara interne rute", () => {
    const rule = ruleFor("*");

    expect(rule?.disallow).toBe("/api/");
    expect(rule?.allow).toContain("/");
  });

  it("propušta posrednik za slike, da tražilice dohvate grbove i OG slike", () => {
    expect(ruleFor("*")?.allow).toContain("/api/images/");
  });

  it("zabranjuje robota koji skuplja podatke za treniranje modela", () => {
    expect(ruleFor("CCBot")?.disallow).toBe("/");
  });

  it("izrijekom propušta robote AI tražilica, uz istu zaštitu internih ruta", () => {
    for (const agent of [
      "GPTBot",
      "OAI-SearchBot",
      "ChatGPT-User",
      "PerplexityBot",
      "Perplexity-User",
      "ClaudeBot",
      "Claude-User",
      "Google-Extended",
    ]) {
      const rule = ruleFor(agent);
      expect(rule, `pravilo za ${agent}`).toBeDefined();
      expect(rule?.allow).toBe("/");
      expect(rule?.disallow).toBe("/api/");
    }
  });

  it("robot za treniranje ostaje zabranjen i kada AI tražilice imaju pristup", () => {
    expect(ruleFor("CCBot")?.allow).toBeUndefined();
  });
});
