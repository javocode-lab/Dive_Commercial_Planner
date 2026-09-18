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
    expect(result.finalPressureGroup.status).toBe("available");
    expect(result.finalPressureGroup.group).toBe("B");
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
    expect(result.calculationSteps.some((step) => step.category === "pressureGroup")).toBe(true);
    expect(result.calculationSteps.some((step) => step.category === "surfaceInterval")).toBe(true);
    expect(result.finalPressureGroup.status).toBe("available");
    expect(result.datasetVersion).toContain("cmas_fedecas_table_i");
    expect(result.engineVersion).toContain("recreational-air-engine");
  });
});


describe("pressure group assignment", () => {
  test("9 m / 15 min assigns group A", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 9, bottomTime: 15, gas: "air" });
    expect(result.status).toBe("within_table_limit");
    expect(result.finalPressureGroup.status).toBe("available");
    expect(result.finalPressureGroup.group).toBe("A");
    expect(result.finalPressureGroup.matchedRange?.maxInclusiveTimeMinutes).toBe(15);
  });

  test("9 m / 16 min assigns group B", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 9, bottomTime: 16, gas: "air" });
    expect(result.finalPressureGroup.group).toBe("B");
  });

  test("18 m / 55 min assigns group I at the NDL boundary", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 18, bottomTime: 55, gas: "air" });
    expect(result.status).toBe("within_table_limit");
    expect(result.finalPressureGroup.group).toBe("I");
    expect(result.remainingTime).toBe(0);
  });

  test("17 m / 20 min rounds to 18 m and assigns group D", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 17, bottomTime: 20, gas: "air" });
    expect(result.effectiveDepth?.meters).toBe(18);
    expect(result.finalPressureGroup.group).toBe("D");
  });

  test("39 m / 5 min assigns group C", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 39, bottomTime: 5, gas: "air" });
    expect(result.status).toBe("within_table_limit");
    expect(result.finalPressureGroup.group).toBe("C");
  });

  test("when time exceeds NDL, no pressure group is assigned", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 9, bottomTime: 251, gas: "air" });
    expect(result.status).toBe("exceeds_table_time_limit");
    expect(result.finalPressureGroup.status).toBe("not_applicable");
    expect(result.finalPressureGroup.group).toBeNull();
  });
});

describe("surface interval foundation", () => {
  test("a valid first dive prepares the next repetitive-dive phase from final pressure group", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 18, bottomTime: 20, gas: "air" });
    expect(result.finalPressureGroup.group).toBe("D");
    expect(result.repetitiveDiveReadiness.status).toBe("ready_for_repetitive_input");
    expect(result.repetitiveDiveReadiness.previousDivePressureGroup).toBe("D");
    expect(result.repetitiveDiveReadiness.table).toBe("Tabla II");
    expect(result.repetitiveDiveReadiness.surfaceIntervalMinutes).toBeNull();
    expect(result.repetitiveDiveReadiness.resultingPressureGroup).toBeNull();
  });

  test("an invalid or exceeded plan is not eligible for surface interval processing", () => {
    const result = calculateRecreationalAirDive({ unitSystem: "metric", depth: 9, bottomTime: 251, gas: "air" });
    expect(result.status).toBe("exceeds_table_time_limit");
    expect(result.repetitiveDiveReadiness.status).toBe("not_applicable");
    expect(result.repetitiveDiveReadiness.previousDivePressureGroup).toBeNull();
  });
});

describe("repetitive dive v2.5", () => {
  test("calculates surface interval, new pressure group and residual nitrogen for a valid repetitive plan", () => {
    const result = calculateRecreationalAirDive({
      unitSystem: "metric",
      depth: 18,
      bottomTime: 20,
      gas: "air",
      repetitiveDive: {
        surfaceIntervalMinutes: 120,
        secondDiveDepth: 18,
        secondDiveBottomTime: 20
      }
    });

    expect(result.status).toBe("within_table_limit");
    expect(result.finalPressureGroup.group).toBe("D");
    expect(result.repetitiveDiveAnalysis.status).toBe("calculated_within_adjusted_limit");
    expect(result.repetitiveDiveAnalysis.surfaceInterval.resultingPressureGroup).toBe("C");
    expect(result.repetitiveDiveAnalysis.residualNitrogen.secondDiveEffectiveDepth?.meters).toBe(18);
    expect(result.repetitiveDiveAnalysis.residualNitrogen.residualNitrogenMinutes).toBe(17);
    expect(result.repetitiveDiveAnalysis.residualNitrogen.adjustedNoDecompressionLimitMinutes).toBe(38);
    expect(result.repetitiveDiveAnalysis.residualNitrogen.totalEquivalentBottomTimeMinutes).toBe(37);
    expect(result.repetitiveDiveAnalysis.residualNitrogen.remainingAdjustedNoDecompressionTimeMinutes).toBe(18);
  });

  test("blocks repetitive calculation when surface interval is below Table II minimum", () => {
    const result = calculateRecreationalAirDive({
      unitSystem: "metric",
      depth: 18,
      bottomTime: 20,
      gas: "air",
      repetitiveDive: {
        surfaceIntervalMinutes: 5,
        secondDiveDepth: 18,
        secondDiveBottomTime: 20
      }
    });

    expect(result.repetitiveDiveAnalysis.status).toBe("surface_interval_out_of_range");
    expect(result.repetitiveDiveAnalysis.surfaceInterval.resultingPressureGroup).toBeNull();
    expect(result.repetitiveDiveAnalysis.residualNitrogen.residualNitrogenMinutes).toBeNull();
  });

  test("blocks repetitive calculation when surface interval is above Table II maximum", () => {
    const result = calculateRecreationalAirDive({
      unitSystem: "metric",
      depth: 18,
      bottomTime: 20,
      gas: "air",
      repetitiveDive: {
        surfaceIntervalMinutes: 721,
        secondDiveDepth: 18,
        secondDiveBottomTime: 20
      }
    });

    expect(result.repetitiveDiveAnalysis.status).toBe("surface_interval_out_of_range");
  });

  test("second dive depth rounds up before Table III lookup", () => {
    const result = calculateRecreationalAirDive({
      unitSystem: "metric",
      depth: 18,
      bottomTime: 20,
      gas: "air",
      repetitiveDive: {
        surfaceIntervalMinutes: 120,
        secondDiveDepth: 17,
        secondDiveBottomTime: 20
      }
    });

    expect(result.repetitiveDiveAnalysis.residualNitrogen.secondDiveEffectiveDepth?.meters).toBe(18);
    expect(result.repetitiveDiveAnalysis.residualNitrogen.secondDiveDepthRounded).toBe(true);
  });

  test("detects when the second dive exceeds the adjusted no-decompression limit", () => {
    const result = calculateRecreationalAirDive({
      unitSystem: "metric",
      depth: 18,
      bottomTime: 20,
      gas: "air",
      repetitiveDive: {
        surfaceIntervalMinutes: 360,
        secondDiveDepth: 39,
        secondDiveBottomTime: 3
      }
    });

    expect(result.repetitiveDiveAnalysis.surfaceInterval.resultingPressureGroup).toBe("A");
    expect(result.repetitiveDiveAnalysis.residualNitrogen.residualNitrogenMinutes).toBe(3);
    expect(result.repetitiveDiveAnalysis.residualNitrogen.adjustedNoDecompressionLimitMinutes).toBe(2);
    expect(result.repetitiveDiveAnalysis.status).toBe("exceeds_adjusted_no_decompression_limit");
  });

  test("blocks unsupported Table III cells while still exposing residual nitrogen minutes", () => {
    const result = calculateRecreationalAirDive({
      unitSystem: "metric",
      depth: 10.5,
      bottomTime: 220,
      gas: "air",
      repetitiveDive: {
        surfaceIntervalMinutes: 10,
        secondDiveDepth: 12,
        secondDiveBottomTime: 5
      }
    });

    expect(result.finalPressureGroup.group).toBe("M");
    expect(result.repetitiveDiveAnalysis.surfaceInterval.resultingPressureGroup).toBe("M");
    expect(result.repetitiveDiveAnalysis.residualNitrogen.residualNitrogenMinutes).toBe(187);
    expect(result.repetitiveDiveAnalysis.residualNitrogen.adjustedNoDecompressionLimitMinutes).toBeNull();
    expect(result.repetitiveDiveAnalysis.status).toBe("residual_table_entry_not_supported");
  });

  test("supports imperial repetitive input and Table III lookup", () => {
    const result = calculateRecreationalAirDive({
      unitSystem: "imperial",
      depth: 60,
      bottomTime: 20,
      gas: "air",
      repetitiveDive: {
        surfaceIntervalMinutes: 120,
        secondDiveDepth: 60,
        secondDiveBottomTime: 20
      }
    });

    expect(result.finalPressureGroup.group).toBe("D");
    expect(result.repetitiveDiveAnalysis.surfaceInterval.resultingPressureGroup).toBe("C");
    expect(result.repetitiveDiveAnalysis.residualNitrogen.secondDiveEffectiveDepth?.feet).toBe(60);
    expect(result.repetitiveDiveAnalysis.residualNitrogen.residualNitrogenMinutes).toBe(17);
  });
});
