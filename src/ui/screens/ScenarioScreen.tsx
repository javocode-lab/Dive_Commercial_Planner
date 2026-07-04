import {
  PORT_TYPE_OPTIONS,
  SCENARIO_OPTIONS
} from "../../domain/dive-planning/constants";
import type { PortType, PreliminaryDivePlan, ScenarioType } from "../../domain/dive-planning/types";
import { NoticeBox } from "../components/NoticeBox";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { ScenarioCard } from "../components/ScenarioCard";
import { StepHeader } from "../components/StepHeader";

type ScenarioScreenProps = {
  plan: PreliminaryDivePlan;
  onBack: () => void;
  onContinue: () => void;
  onChange: (patch: Partial<PreliminaryDivePlan>) => void;
};

export function ScenarioScreen({
  plan,
  onBack,
  onContinue,
  onChange
}: ScenarioScreenProps) {
  const selectedScenario = SCENARIO_OPTIONS.find((item) => item.id === plan.scenario);
  const requiresPortType = plan.scenario === "port";
  const canContinue = plan.scenario !== null && (!requiresPortType || plan.portType !== null);

  const selectScenario = (scenario: ScenarioType) => {
    onChange({
      scenario,
      portType: scenario === "port" ? plan.portType : null,
      status: "in_progress"
    });
  };

  const selectPortType = (portType: PortType) => {
    onChange({ portType, status: "in_progress" });
  };

  return (
    <section className="screen">
      <StepHeader
        title="Seleccionar escenario"
        subtitle="Elegí el entorno principal de operación."
        currentStep={1}
        totalSteps={4}
        onBack={onBack}
      />

      <div className="scenario-grid">
        {SCENARIO_OPTIONS.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            icon={scenario.icon}
            title={scenario.title}
            description={scenario.description}
            selected={plan.scenario === scenario.id}
            onSelect={() => selectScenario(scenario.id)}
          />
        ))}
      </div>

      {selectedScenario?.requiresAltitudeLater && (
        <NoticeBox
          tone="warning"
          title="Altitud en fase posterior"
          message="Este escenario requerirá validación de altitud antes de usar tablas o límites técnicos."
        />
      )}

      {requiresPortType && (
        <section className="content-card">
          <h2>Tipo de puerto</h2>
          <p>Este dato ayuda a distinguir una operación marítima de una operación fluvial o interior.</p>
          <div className="stacked-options">
            {PORT_TYPE_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={
                  plan.portType === option.id ? "wide-card wide-card--selected" : "wide-card"
                }
                type="button"
                onClick={() => selectPortType(option.id)}
              >
                <span className="radio-mark">{plan.portType === option.id ? "●" : "○"}</span>
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <PrimaryActionBar
        secondaryLabel="Atrás"
        primaryLabel="Continuar"
        primaryDisabled={!canContinue}
        onSecondary={onBack}
        onPrimary={onContinue}
      />
    </section>
  );
}
