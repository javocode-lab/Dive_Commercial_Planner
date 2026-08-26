import { describe, expect, test } from "vitest";
import { calculateRecreationalAirDive } from "../src/domain/dive-planner-core/recreational/air/AirDiveCalculator";

describe("calculateRecreationalAirDive", () => {
  test("9 m / 20 min uses 9 m and remains within the 250 min limit", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 9, bottomTime: 20, gas: "air" });
    expect(result.status).toBe("within_table_limit");
    expect(result.effectiveDepth?.meters).toBe(9);
    expect(result.limit).toBe(250);
    expect(result.remainingTime).toBe(230);
    expect(result.rounding.depthRounded).toBe(false);
  });
  test("9 m / 250 min is allowed exactly at the table limit", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 9, bottomTime: 250, gas: "air" });
    expect(result.status).toBe("within_table_limit");
    expect(result.remainingTime).toBe(0);
  });
  test("9 m / 251 min exceeds the table limit by 1 minute", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 9, bottomTime: 251, gas: "air" });
    expect(result.status).toBe("exceeds_table_time_limit");
    expect(result.limit).toBe(250);
    expect(result.remainingTime).toBe(-1);
  });
  test("17 m rounds up to the 18 m row", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 17, bottomTime: 20, gas: "air" });
    expect(result.status).toBe("within_table_limit");
    expect(result.effectiveDepth?.meters).toBe(18);
    expect(result.effectiveDepth?.feet).toBe(60);
    expect(result.limit).toBe(55);
    expect(result.rounding.depthRounded).toBe(true);
  });
  test("55 ft rounds up to the 60 ft row", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "imperial", depth: 55, bottomTime: 30, gas: "air" });
    expect(result.status).toBe("within_table_limit");
    expect(result.effectiveDepth?.feet).toBe(60);
    expect(result.effectiveDepth?.meters).toBe(18);
    expect(result.limit).toBe(55);
    expect(result.rounding.depthRounded).toBe(true);
  });
  test("39 m is supported by the prototype maximum", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 39, bottomTime: 5, gas: "air" });
    expect(result.status).toBe("within_table_limit");
    expect(result.limit).toBe(5);
    expect(result.remainingTime).toBe(0);
  });
  test("40 m is outside the supported depth range", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 40, bottomTime: 5, gas: "air" });
    expect(result.status).toBe("unsupported_depth");
    expect(result.limit).toBeNull();
  });
  test("131 ft is outside the supported depth range", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "imperial", depth: 131, bottomTime: 5, gas: "air" });
    expect(result.status).toBe("unsupported_depth");
    expect(result.limit).toBeNull();
  });
  test("calculation detail is generated from calculationSteps", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 17, bottomTime: 20, gas: "air" });
    expect(result.calculationSteps.some((step) => step.category === "rounding")).toBe(true);
    expect(result.calculationSteps.some((step) => step.category === "comparison")).toBe(true);
    expect(result.datasetVersion).toContain("cmas_fedecas_table_i");
    expect(result.engineVersion).toContain("recreational-air-engine");
  });
});
