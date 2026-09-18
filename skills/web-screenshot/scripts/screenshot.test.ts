import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { calculateAspectHeight } from "./screenshot.ts";

describe("calculateAspectHeight", () => {
  test("returns undefined when no aspect ratio is given", () => {
    assert.equal(calculateAspectHeight(1200, undefined), undefined);
  });

  test("computes height from a W:H ratio", () => {
    assert.equal(calculateAspectHeight(1920, "16:9"), 1080);
  });

  test("rounds fractional results", () => {
    assert.equal(calculateAspectHeight(1000, "3:1"), 333);
  });

  test("accepts decimal ratio components", () => {
    assert.equal(calculateAspectHeight(1000, "2.5:1"), 400);
  });

  test("rejects a malformed ratio", () => {
    assert.throws(
      () => calculateAspectHeight(1200, "wide"),
      /Invalid aspect ratio/,
    );
  });

  test("rejects a zero or negative ratio component", () => {
    assert.throws(() => calculateAspectHeight(1200, "0:9"), /greater than 0/);
    assert.throws(() => calculateAspectHeight(1200, "16:0"), /greater than 0/);
  });
});
