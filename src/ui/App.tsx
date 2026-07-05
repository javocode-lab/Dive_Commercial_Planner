import { useEffect, useMemo, useState } from "react";

import {
  createInitialPreliminaryPlan,
  derivePreliminaryPlanStatus,
  getDefaultDepthForUnitSystem,
  getDepthUnitForUnitSystem
} from "../domain/dive-planning/preliminaryPlan";
import type {
  PreliminaryDivePlan,
  WizardStep
} from "../domain/dive-planning/types";
import { DepthScreen } from "./screens/DepthScreen";
import { NewPlanIntroScreen } from "./screens/NewPlanIntroScreen";
import { OperationalConfirmationScreen } from "./screens/OperationalConfirmationScreen";
import { PreliminarySummaryScreen } from "./screens/PreliminarySummaryScreen";
import { ScenarioScreen } from "./screens/ScenarioScreen";
import { StartScreen } from "./screens/StartScreen";
import { UnitSystemScreen } from "./screens/UnitSystemScreen";
import { ThemeToggle, type ThemeMode } from "./components/ThemeToggle";

export function App() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("start");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const savedTheme = window.localStorage.getItem("dive-ui-theme");

    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  });
  const [plan, setPlan] = useState<PreliminaryDivePlan>(() =>
    createInitialPreliminaryPlan()
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("dive-ui-theme", theme);
  }, [theme]);

  const updatePlan = (patch: Partial<PreliminaryDivePlan>) => {
    setPlan((currentPlan) => {
      const nextPlan = {
        ...currentPlan,
        ...patch
      };

      return {
        ...nextPlan,
        status: patch.status ?? derivePreliminaryPlanStatus(nextPlan)
      };
    });
  };

  const startNewPlan = () => {
    setPlan(createInitialPreliminaryPlan());
    setCurrentStep("intro");
  };

  const startDemoPlan = () => {
    setPlan({
      ...createInitialPreliminaryPlan(),
      scenario: "quarry",
      unitSystem: "metric",
      plannedDepth: 18,
      depthUnit: "m",
      depthSource: "supervisor",
      status: "in_progress"
    });
    setCurrentStep("scenario");
  };

  const resetAndGoHome = () => {
    setPlan(createInitialPreliminaryPlan());
    setCurrentStep("start");
  };

  const finishPreliminaryPlan = () => {
    setPlan((currentPlan) => ({
      ...currentPlan,
      status: "requires_technical_phase"
    }));
    setCurrentStep("summary");
  };

  const normalizedPlan = useMemo(() => {
    if (plan.plannedDepth !== null) {
      return plan;
    }

    return {
      ...plan,
      plannedDepth: getDefaultDepthForUnitSystem(plan.unitSystem),
      depthUnit: getDepthUnitForUnitSystem(plan.unitSystem)
    };
  }, [plan]);

  return (
    <main className="app-shell">
      <ThemeToggle theme={theme} onChange={setTheme} />
      {currentStep === "start" && (
        <StartScreen onStart={startNewPlan} onDemo={startDemoPlan} />
      )}

      {currentStep === "intro" && (
        <NewPlanIntroScreen
          onBack={() => setCurrentStep("start")}
          onContinue={() => setCurrentStep("scenario")}
        />
      )}

      {currentStep === "scenario" && (
        <ScenarioScreen
          plan={normalizedPlan}
          onBack={() => setCurrentStep("intro")}
          onContinue={() => setCurrentStep("units")}
          onChange={updatePlan}
        />
      )}

      {currentStep === "units" && (
        <UnitSystemScreen
          plan={normalizedPlan}
          onBack={() => setCurrentStep("scenario")}
          onContinue={() => setCurrentStep("depth")}
          onChange={updatePlan}
        />
      )}

      {currentStep === "depth" && (
        <DepthScreen
          plan={normalizedPlan}
          onBack={() => setCurrentStep("units")}
          onContinue={() => setCurrentStep("confirmation")}
          onChange={updatePlan}
        />
      )}

      {currentStep === "confirmation" && (
        <OperationalConfirmationScreen
          plan={normalizedPlan}
          onBack={() => setCurrentStep("depth")}
          onFinish={finishPreliminaryPlan}
          onChange={updatePlan}
        />
      )}

      {currentStep === "summary" && (
        <PreliminarySummaryScreen
          plan={normalizedPlan}
          onEdit={() => setCurrentStep("scenario")}
          onNewPlan={resetAndGoHome}
        />
      )}
    </main>
  );
}
