import { describe, expect, test } from "vitest";
import { APP_CONFIG } from "../src/config/appConfig";
import type { DivePlanDraft } from "../src/domain/types";
import { buildPlanInput } from "../src/domain/validation";

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

describe("buildPlanInput", () => {
  test("creates valid input for sea scenario without altitude", () => {
    const result = buildPlanInput(createBaseDraft());

    expect(result.input).not.toBeNull();
    expect(result.issues).toHaveLength(0);
    expect(result.input?.altitudeMeters).toBeNull();
  });

  test("blocks when depth is missing", () => {
    const result = buildPlanInput({
      ...createBaseDraft(),
      depthValue: ""
    });

    expect(result.input).toBeNull();
    expect(result.issues.some((issue) => issue.field === "depthValue")).toBe(
      true
    );
  });

  test("requires altitude for non-sea scenario", () => {
    const result = buildPlanInput({
      ...createBaseDraft(),
      scenario: "lake",
      altitudeSource: "manual",
      altitudeValue: "",
      altitudeConfirmed: false
    });

    expect(result.input).toBeNull();
    expect(result.issues.some((issue) => issue.field === "altitudeValue")).toBe(
      true
    );
    expect(
      result.issues.some((issue) => issue.field === "altitudeConfirmed")
    ).toBe(true);
  });

  test("accepts altitude for non-sea scenario when provided and confirmed", () => {
    const result = buildPlanInput({
      ...createBaseDraft(),
      scenario: "lake",
      altitudeSource: "manual",
      altitudeValue: "500",
      altitudeConfirmed: true
    });

    expect(result.input).not.toBeNull();
    expect(result.input?.altitudeMeters).toBe(500);
  });
});
