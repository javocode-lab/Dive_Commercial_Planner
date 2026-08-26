import { describe, expect, test } from "vitest";
import { APP_CONFIG } from "../src/config/appConfig";
import { calculateDivePlan } from "../src/domain/divePlanner";
import type { DivePlanDraft } from "../src/domain/types";

function createBaseDraft(): DivePlanDraft {
  return {
    unitSystem: "metric",
    scenario: "sea",
    depthValue: "12",
    plannedBottomTimeMinutes: "20",
    altitudeValue: "",
    altitudeSource: "not_required",
    altitudeConfirmed: false,
    tableId: APP_CONFIG.defaultTableId,
    gas: "air",
    acknowledgedLimitations: true
  };
}

describe("calculateDivePlan", () => {
  test("returns mock_only result for valid sea scenario within mock limit", () => {
    const result = calculateDivePlan(createBaseDraft());

    expect(result.status).toBe("mock_only");
    expect(result.referenceLimitMinutes).toBe(30);
    expect(result.remainingMarginMinutes).toBe(10);
    expect(result.alerts.length).toBeGreaterThan(0);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  test("blocks when planned bottom time exceeds mock limit", () => {
    const result = calculateDivePlan({
      ...createBaseDraft(),
      plannedBottomTimeMinutes: "40"
    });

    expect(result.status).toBe("blocked");
    expect(result.remainingMarginMinutes).toBe(-10);
  });

  test("blocks non-sea scenario because altitude model is pending", () => {
    const result = calculateDivePlan({
      ...createBaseDraft(),
      scenario: "lake",
      altitudeSource: "manual",
      altitudeValue: "500",
      altitudeConfirmed: true
    });

    expect(result.status).toBe("blocked");
    expect(
      result.alerts.some((alert) =>
        alert.message.includes("Equivalent Sea Level Depth")
      )
    ).toBe(true);
  });

  test("blocks invalid draft before calculation", () => {
    const result = calculateDivePlan({
      ...createBaseDraft(),
      depthValue: ""
    });

    expect(result.status).toBe("blocked");
    expect(result.input).toBeNull();
    expect(result.validationIssues.length).toBeGreaterThan(0);
  });
});
