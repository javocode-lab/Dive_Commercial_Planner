import {
  DEPTH_SOURCE_OPTIONS,
  IMPERIAL_DEPTH_OPTIONS,
  METRIC_DEPTH_OPTIONS
} from "../../domain/dive-planning/constants";
import type { DepthSource, PreliminaryDivePlan } from "../../domain/dive-planning/types";
import { DepthQuickSelect } from "../components/DepthQuickSelect";
import { DepthStepper } from "../components/DepthStepper";
import { NoticeBox } from "../components/NoticeBox";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StepHeader } from "../components/StepHeader";

type DepthScreenProps = {
  plan: PreliminaryDivePlan;
  onBack: () => void;
  onContinue: () => void;
  onChange: (patch: Partial<PreliminaryDivePlan>) => void;
};

export function DepthScreen({ plan, onBack, onContinue, onChange }: DepthScreenProps) {
  const depthValue = plan.plannedDepth ?? (plan.unitSystem === "metric" ? 18 : 60);
  const depthOptions = plan.unitSystem === "metric" ? METRIC_DEPTH_OPTIONS : IMPERIAL_DEPTH_OPTIONS;
  const step = plan.unitSystem === "metric" ? 1 : 5;
  const max = plan.unitSystem === "metric" ? 300 : 1000;
  const canContinue = depthValue > 0 && plan.depthSource !== null;

  const selectDepthSource = (depthSource: DepthSource) => {
    onChange({ depthSource, status: "in_progress" });
  };

  return (
    <section className="screen">
      <StepHeader
        title="Profundidad planificada"
        subtitle="Seleccioná la profundidad máxima esperada para este plan preliminar."
        currentStep={3}
        totalSteps={4}
        onBack={onBack}
      />

      <DepthStepper
        value={depthValue}
        unit={plan.depthUnit}
        step={step}
        min={step}
        max={max}
        onChange={(plannedDepth) => onChange({ plannedDepth, status: "in_progress" })}
      />

      <section className="content-card">
        <h2>Valores rápidos</h2>
        <DepthQuickSelect
          options={depthOptions}
          selectedValue={plan.plannedDepth}
          unit={plan.depthUnit}
          onSelect={(plannedDepth) => onChange({ plannedDepth, status: "in_progress" })}
        />
      </section>

      <section className="content-card">
        <h2>Fuente del dato</h2>
        <p>Este dato es sensible. La fuente debe quedar visible en el resumen.</p>
        <div className="stacked-options">
          {DEPTH_SOURCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={
                plan.depthSource === option.id ? "wide-card wide-card--selected" : "wide-card"
              }
              type="button"
              onClick={() => selectDepthSource(option.id)}
            >
              <span className="radio-mark">{plan.depthSource === option.id ? "●" : "○"}</span>
              <span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      {plan.depthSource === "estimated" && (
        <NoticeBox
          tone="warning"
          title="Profundidad estimada"
          message="La profundidad estimada puede requerir margen conservador y confirmación adicional en una fase posterior."
        />
      )}

      <NoticeBox
        tone="info"
        message="La validación contra tablas, redondeos y límites técnicos se agregará en la siguiente fase."
      />

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
