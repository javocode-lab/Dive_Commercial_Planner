import { APP_CONFIG } from "../config/appConfig";
import type { CalculationResult, HistoryItem } from "../domain/types";

const HISTORY_KEY = "dcp_history_web_v0_1";

export function createHistoryItemFromResult(
  result: CalculationResult
): HistoryItem | null {
  if (!result.input) {
    return null;
  }

  return {
    id: result.id,
    createdAt: result.createdAt,
    scenario: result.input.scenario,
    depthMeters: result.input.depthMeters,
    plannedBottomTimeMinutes: result.input.plannedBottomTimeMinutes,
    status: result.status,
    tableLabel: result.tableLabel,
    referenceLimitMinutes: result.referenceLimitMinutes
  };
}

export function loadHistory(): HistoryItem[] {
  const rawValue = window.localStorage.getItem(HISTORY_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue as HistoryItem[];
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: HistoryItem): void {
  const currentHistory = loadHistory();
  const nextHistory = [item, ...currentHistory].slice(
    0,
    APP_CONFIG.maxHistoryItems
  );

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
}

export function clearStoredHistory(): void {
  window.localStorage.removeItem(HISTORY_KEY);
}
