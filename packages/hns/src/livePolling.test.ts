import { describe, expect, it } from "vitest";
import { liveFetchPlan } from "./livePolling";

const MIN = 60 * 1000;

const KICKOFF = Date.UTC(2026, 10, 21, 14, 0);

const NOTHING = { poll: false, fetchOnce: false };

const POLL = { poll: true, fetchOnce: false };

const ONCE = { poll: false, fetchOnce: true };

describe("liveFetchPlan", () => {
  it("does nothing 61 min before kick-off", () => {
    expect(liveFetchPlan(KICKOFF, null, KICKOFF - 61 * MIN)).toEqual(NOTHING);
  });

  it("polls 59 min before kick-off, when lineups appear", () => {
    expect(liveFetchPlan(KICKOFF, null, KICKOFF - 59 * MIN)).toEqual(POLL);
  });

  it("polls while the match is running", () => {
    expect(liveFetchPlan(KICKOFF, "RUNNING", KICKOFF + 50 * MIN)).toEqual(POLL);
  });

  it("stops once HNS says PLAYED, even inside the window", () => {
    expect(liveFetchPlan(KICKOFF, "PLAYED", KICKOFF + 100 * MIN)).toEqual(
      NOTHING,
    );
  });

  it("still polls 2 h 59 min after kick-off (extra time, late finish)", () => {
    expect(liveFetchPlan(KICKOFF, "RUNNING", KICKOFF + 179 * MIN)).toEqual(
      POLL,
    );
  });

  it("stops polling 3 h 1 min after kick-off", () => {
    expect(liveFetchPlan(KICKOFF, "RUNNING", KICKOFF + 181 * MIN).poll).toBe(
      false,
    );
  });

  it("fetches once when the window is over but the cached HTML predates the result", () => {
    expect(liveFetchPlan(KICKOFF, null, KICKOFF + 181 * MIN)).toEqual(ONCE);
    expect(
      liveFetchPlan(KICKOFF, "RUNNING", KICKOFF + 3 * 24 * 60 * MIN),
    ).toEqual(ONCE);
  });

  it("does nothing for a played match opened days later", () => {
    expect(
      liveFetchPlan(KICKOFF, "PLAYED", KICKOFF + 3 * 24 * 60 * MIN),
    ).toEqual(NOTHING);
  });

  it("does nothing for a cancelled or postponed match, even at kick-off", () => {
    expect(liveFetchPlan(KICKOFF, "CANCELED", KICKOFF)).toEqual(NOTHING);
    expect(liveFetchPlan(KICKOFF, "POSTPONED", KICKOFF + 30 * MIN)).toEqual(
      NOTHING,
    );
    expect(liveFetchPlan(KICKOFF, "CANCELED", KICKOFF + 181 * MIN)).toEqual(
      NOTHING,
    );
  });

  it("does nothing without a kick-off time", () => {
    expect(liveFetchPlan(null, null, KICKOFF)).toEqual(NOTHING);
  });
});
