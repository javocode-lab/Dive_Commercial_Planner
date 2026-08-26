import { useEffect, useState } from "react";
import { calculateRecreationalAirDive } from "../domain/dive-planner-core/recreational/air/AirDiveCalculator";
import type { RecreationalAirDiveResult } from "../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { ThemeToggle, type ThemeMode } from "./components/ThemeToggle";
import { StartScreen } from "./screens/StartScreen";
import { CalculationDetailScreen } from "./screens/recreational/CalculationDetailScreen";
import { HumanValidationScreen } from "./screens/recreational/HumanValidationScreen";
import { RecreationalPlanScreen, type RecreationalPlanDraft } from "./screens/recreational/RecreationalPlanScreen";
import { RecreationalResultScreen } from "./screens/recreational/RecreationalResultScreen";
type RecreationalWizardStep = "start" | "plan" | "result" | "calculationDetail" | "humanValidation";
const INITIAL_RECREATIONAL_DRAFT: RecreationalPlanDraft = { unitSystem: "metric", depth: 18, bottomTime: 30, gas: "air" };
export function App() {
  const [currentStep, setCurrentStep] = useState<RecreationalWizardStep>("start");
  const [theme, setTheme] = useState<ThemeMode>(() => { const savedTheme = window.localStorage.getItem("dive-ui-theme"); return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark"; });
  const [draft, setDraft] = useState<RecreationalPlanDraft>(INITIAL_RECREATIONAL_DRAFT);
  const [result, setResult] = useState<RecreationalAirDiveResult | null>(null);
  useEffect(() => { document.documentElement.dataset.theme = theme; window.localStorage.setItem("dive-ui-theme", theme); }, [theme]);
  const updateDraft = (patch: Partial<RecreationalPlanDraft>) => setDraft((currentDraft) => ({ ...currentDraft, ...patch }));
  const startNewPlan = () => { setDraft(INITIAL_RECREATIONAL_DRAFT); setResult(null); setCurrentStep("plan"); };
  const startDemoPlan = () => { const demoDraft: RecreationalPlanDraft = { unitSystem: "metric", depth: 17, bottomTime: 50, gas: "air" }; setDraft(demoDraft); setResult(calculateRecreationalAirDive(demoDraft)); setCurrentStep("result"); };
  const calculatePlan = () => { setResult(calculateRecreationalAirDive(draft)); setCurrentStep("result"); };
  const resetAndGoHome = () => { setDraft(INITIAL_RECREATIONAL_DRAFT); setResult(null); setCurrentStep("start"); };
  return <main className="app-shell"><ThemeToggle theme={theme} onChange={setTheme} />
    {currentStep === "start" && <StartScreen onStart={startNewPlan} onDemo={startDemoPlan} />}
    {currentStep === "plan" && <RecreationalPlanScreen draft={draft} onChange={updateDraft} onBack={resetAndGoHome} onCalculate={calculatePlan} />}
    {currentStep === "result" && result && <RecreationalResultScreen result={result} onBack={() => setCurrentStep("plan")} onDetail={() => setCurrentStep("calculationDetail")} onValidate={() => setCurrentStep("humanValidation")} onNewPlan={resetAndGoHome} />}
    {currentStep === "calculationDetail" && result && <CalculationDetailScreen result={result} onBack={() => setCurrentStep("result")} onValidate={() => setCurrentStep("humanValidation")} />}
    {currentStep === "humanValidation" && result && <HumanValidationScreen result={result} onBack={() => setCurrentStep("calculationDetail")} onNewPlan={resetAndGoHome} />}
  </main>;
}
