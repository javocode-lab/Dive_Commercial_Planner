import { useDivePlanner } from "../state/useDivePlanner";
import { HistoryScreen } from "./screens/HistoryScreen";
import { PlanFormScreen } from "./screens/PlanFormScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { ReviewScreen } from "./screens/ReviewScreen";
import { SafetyGateScreen } from "./screens/SafetyGateScreen";

export function App() {
  const planner = useDivePlanner();

  return (
    <main className="app-shell">
      {planner.screen === "safety" && (
        <SafetyGateScreen onAccept={planner.acceptSafetyLimitations} />
      )}

      {planner.screen === "form" && (
        <PlanFormScreen
          draft={planner.draft}
          onChangeDraft={planner.updateDraft}
          onGoToReview={planner.goToReview}
          onOpenHistory={planner.openHistory}
        />
      )}

      {planner.screen === "review" && (
        <ReviewScreen
          validation={planner.validationPreview}
          onBack={planner.goToForm}
          onCalculate={planner.calculate}
        />
      )}

      {planner.screen === "result" && planner.result && (
        <ResultScreen
          result={planner.result}
          onNewPlan={planner.resetPlan}
          onBackToForm={planner.goToForm}
          onOpenHistory={planner.openHistory}
        />
      )}

      {planner.screen === "history" && (
        <HistoryScreen
          history={planner.history}
          onBack={planner.goToForm}
          onClearHistory={planner.clearHistory}
        />
      )}
    </main>
  );
}
