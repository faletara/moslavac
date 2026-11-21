import { describe, expect, it } from "vitest";
import type { Competition } from "@/types/hns";
import {
  competitionPagePaths,
  competitionPath,
  parseCompetitionId,
  resolveCompetitionRoute,
} from "./competition";

function competition(id: number | null, name: string): Competition {
  return { id, name } as Competition;
}

const youth = competition(3, "1. ŽNL Juniori");
const senior = competition(7, "1. ŽNL Seniori");
const cup = competition(12, "Kup ŽNS");
const competitions = [competition(null, "Bez id-a"), youth, senior, cup];

describe("competitionPagePaths", () => {
  it("vraća putanje svih natjecanja osim zadanog", () => {
    expect(competitionPagePaths({ competitions, seniorFilter: "Seniori" })).toEqual([
      "/raspored-i-rezultati/natjecanje/3",
      "/raspored-i-rezultati/natjecanje/12",
    ]);
  });
});

describe("resolveCompetitionRoute", () => {
  it("popis prikazuje seniorsko natjecanje", () => {
    expect(
      resolveCompetitionRoute({
        competitions,
        competitionsOk: true,
        seniorFilter: "Seniori",
        requestedId: null,
      }),
    ).toEqual({ kind: "render", selected: senior, defaultId: 7 });
  });

  it("bez seniorskog natjecanja popis uzima prvo s id-om", () => {
    expect(
      resolveCompetitionRoute({
        competitions,
        competitionsOk: true,
        seniorFilter: null,
        requestedId: null,
      }),
    ).toEqual({ kind: "render", selected: youth, defaultId: 3 });
  });

  it("putanja natjecanja prikazuje to natjecanje", () => {
    expect(
      resolveCompetitionRoute({
        competitions,
        competitionsOk: true,
        seniorFilter: "Seniori",
        requestedId: 12,
      }),
    ).toEqual({ kind: "render", selected: cup, defaultId: 7 });
  });

  it("nepoznato ili zadano natjecanje vraća na popis", () => {
    for (const requestedId of [999, 7]) {
      expect(
        resolveCompetitionRoute({
          competitions,
          competitionsOk: true,
          seniorFilter: "Seniori",
          requestedId,
        }),
      ).toEqual({ kind: "redirect", to: "/raspored-i-rezultati" });
    }
  });

  it("kad HNS zakaže, putanja natjecanja ne preusmjerava nego javlja nedostupnost", () => {
    expect(
      resolveCompetitionRoute({
        competitions: [],
        competitionsOk: false,
        seniorFilter: "Seniori",
        requestedId: 12,
      }),
    ).toEqual({ kind: "render", selected: null, defaultId: null });
  });
});

describe("competitionPath", () => {
  it("zadano natjecanje živi na samom popisu", () => {
    expect(competitionPath(7, 7)).toBe("/raspored-i-rezultati");
  });

  it("ostala natjecanja dobivaju vlastitu putanju", () => {
    expect(competitionPath(12, 7)).toBe("/raspored-i-rezultati/natjecanje/12");
  });
});

describe("parseCompetitionId", () => {
  it("čita pozitivan cijeli broj iz putanje", () => {
    expect(parseCompetitionId("123")).toBe(123);
  });

  it("odbacuje sve što nije pozitivan cijeli broj", () => {
    for (const value of ["", "abc", "0", "-5", "1.5", undefined]) {
      expect(parseCompetitionId(value)).toBeNull();
    }
  });
});
