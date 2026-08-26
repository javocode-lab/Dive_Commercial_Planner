import { UNIT_SYSTEM_OPTIONS } from "../../domain/dive-planning/constants";
import {
  convertAltitudeValue,
  getAltitudeUnitForUnitSystem,
  getDefaultDepthForUnitSystem,
  getDepthUnitForUnitSystem
} from "../../domain/dive-planning/preliminaryPlan";
import type { PreliminaryDivePlan, UnitSystem } from "../../domain/dive-planning/types";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StepHeader } from "../components/StepHeader";
import { UnitSystemCard } from "../components/UnitSystemCard";

export function UnitSystemScreen({
  plan,
  onBack,
  onContinue,
  onChange
}: {
  plan: PreliminaryDivePlan;
  onBack: () => void;
  onContinue: () => void;
  onChange: (patch: Partial<PreliminaryDivePlan>) => void;
}) {
  const selectUnitSystem = (unitSystem: UnitSystem) => {
    const nextAltitudeUnit = getAltitudeUnitForUnitSystem(unitSystem);

    onChange({
      unitSystem,
      depthUnit: getDepthUnitForUnitSystem(unitSystem),
      plannedDepth: getDefaultDepthForUnitSystem(unitSystem),
      altitudeUnit: nextAltitudeUnit,
      altitudeValue: convertAltitudeValue(
        plan.altitudeValue,
        plan.altitudeUnit,
        nextAltitudeUnit
      ),
      status: "in_progress"
    });
  };

  return (
    <section className="screen">
      <StepHeader
        title="Sistema de unidades"
        subtitle="Elegí cómo querés visualizar profundidad y altitud preliminar."
        currentStep={2}
        totalSteps={4}
        onBack={onBack}
      />

      <div className="stacked-options">
        {UNIT_SYSTEM_OPTIONS.map((option) => (
          <UnitSystemCard
            key={option.id}
            title={option.title}
            description={option.description}
            example={option.example}
            selected={plan.unitSystem === option.id}
            onSelect={() => selectUnitSystem(option.id)}
          />
        ))}
      </div>

      <div className="content-card content-card--compact">
        <span>Unidad seleccionada</span>
        <strong>{plan.unitSystem === "metric" ? "Métrico" : "Imperial"}</strong>
        <small>
          Profundidad: {plan.depthUnit} · Altitud: {plan.altitudeUnit}
        </small>
      </div>

      <PrimaryActionBar
        secondaryLabel="Atrás"
        primaryLabel="Continuar"
        onSecondary={onBack}
        onPrimary={onContinue}
      />
    </section>
  );
}
