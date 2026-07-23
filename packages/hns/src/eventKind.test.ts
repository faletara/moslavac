import { describe, expect, it } from "vitest";
import { eventKind } from "./eventKind";

const byName = (name: string) => eventKind({ code: null, name });

describe("eventKind", () => {
  it.each([
    ["GOAL", "goal"],
    ["PENALTY", "goal"],
    ["PENALTY_GOAL", "goal"],
    ["OWN_GOAL", "own-goal"],
    ["YELLOW", "yellow"],
    ["RED", "red"],
    ["SECOND_YELLOW", "red"],
    ["SUBSTITUTION", "sub"],
  ] as const)("prepoznaje stabilni HNS kod %s kao %s", (code, expected) => {
    expect(eventKind({ code, name: "" })).toBe(expected);
  });

  it("neiskorišten kazneni udarac po kodu nije pogodak", () => {
    expect(eventKind({ code: "PENALTY_FAILED", name: "Kazneni udarac" })).toBe(
      "other",
    );
  });

  it("kod ima prednost pred slobodnim tekstom", () => {
    expect(eventKind({ code: "OWN_GOAL", name: "Pogodak" })).toBe("own-goal");
  });

  it("drugi žuti karton daje isti rezultat preko koda i preko naziva", () => {
    expect(eventKind({ code: "SECOND_YELLOW", name: "Drugi žuti karton" })).toBe(
      eventKind({ code: null, name: "Drugi žuti karton" }),
    );
  });

  it.each([
    ["Žuti karton", "yellow"],
    ["Zuti karton", "yellow"],
    ["ŽUTI KARTON", "yellow"],
    ["Drugi žuti karton", "red"],
    ["Crveni karton", "red"],
    ["Zamjena", "sub"],
    ["Izmjena igrača", "sub"],
    ["Pogodak", "goal"],
    ["Gol", "goal"],
    ["Kazneni udarac", "goal"],
    ["Penal", "goal"],
    ["Autogol", "own-goal"],
    ["Pogodak u vlastitu mrežu", "own-goal"],
  ] as const)(
    "bez koda prepoznaje naziv %s kao %s",
    (name, expected) => {
      expect(byName(name)).toBe(expected);
    },
  );

  it("bez koda ne čita neiskorišteni kazneni udarac kao pogodak", () => {
    expect(byName("Neiskorišten kazneni udarac")).toBe("other");
    expect(byName("Promašen kazneni udarac")).toBe("other");
    expect(byName("Promasen penal")).toBe("other");
  });

  it("razlikuje autogol od običnog pogotka", () => {
    expect(byName("Autogol")).not.toBe(byName("Pogodak"));
  });

  it("nepoznatu vrstu degradira u other umjesto da baci grešku", () => {
    expect(byName("Nešto novo iz HNS-a")).toBe("other");
    expect(byName("")).toBe("other");
    expect(eventKind({ code: "NEPOZNATO", name: "" })).toBe("other");
  });
});
