import { useMemo, useState } from "react";

import { APP_CONFIG } from "../config/appConfig";
import { calculateDivePlan } from "../domain/divePlanner";
import type {
  CalculationResult,
  DivePlanDraft,
  HistoryItem
} from "../domain/types";
import { buildPlanInput } from "../domain/validation";
import {
  clearStoredHistory,
  createHistoryItemFromResult,
  loadHistory,
  saveHistoryItem
} from "../services/historyStorage";

export type AppScreen =
  | "safety"
  | "form"
  | "review"
  | "result"
  | "history";

const INITIAL_DRAFT: DivePlanDraft = {
  unitSystem: "metric",
  scenario: "sea",
  depthValue: "",
  plannedBottomTimeMinutes: "",
  altitudeValue: "",
  altitudeSource: "not_required",
  altitudeConfirmed: false,
  tableId: APP_CONFIG.defaultTableId,
  gas: "air",
  acknowledgedLimitations: false
};

export function useDivePlanner() {
  const [screen, setScreen] = useState<AppScreen>("safety");
  const [draft, setDraft] = useState<DivePlanDraft>(INITIAL_DRAFT);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());

  const validationPreview = useMemo(() => {
    return buildPlanInput(draft);
  }, [draft]);

  function updateDraft(partialDraft: Partial<DivePlanDraft>) {
    setDraft((currentDraft) => {
      const nextDraft = {
        ...currentDraft,
        ...partialDraft
      };

      if (partialDraft.scenario === "sea") {
        nextDraft.altitudeSource = "not_required";
        nextDraft.altitudeValue = "";
        nextDraft.altitudeConfirmed = false;
      }

      if (
        partialDraft.scenario &&
        partialDraft.scenario !== "sea" &&
        currentDraft.altitudeSource === "not_required"
      ) {
        nextDraft.altitudeSource = "manual";
      }

      return nextDraft;
    });
  }

  function acceptSafetyLimitations() {
    updateDraft({
      acknowledgedLimitations: true
    });
    setScreen("form");
  }

  function goToReview() {
    setScreen("review");
  }

  function goToForm() {
    setScreen("form");
  }

  function calculate() {
    const nextResult = calculateDivePlan(draft);
    setResult(nextResult);

    const historyItem = createHistoryItemFromResult(nextResult);

    if (historyItem) {
      saveHistoryItem(historyItem);
      setHistory(loadHistory());
    }

    setScreen("result");
  }

  function resetPlan() {
    setDraft({
      ...INITIAL_DRAFT,
      acknowledgedLimitations: true
    });
    setResult(null);
    setScreen("form");
  }

  function openHistory() {
    setHistory(loadHistory());
    setScreen("history");
  }

  function clearHistory() {
    clearStoredHistory();
    setHistory([]);
  }

  return {
    screen,
    draft,
    result,
    history,
    validationPreview,
    updateDraft,
    acceptSafetyLimitations,
    goToReview,
    goToForm,
    calculate,
    resetPlan,
    openHistory,
    clearHistory
  };
}
