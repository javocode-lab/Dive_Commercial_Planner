import { SCENARIO_OPTIONS, UNIT_SYSTEM_OPTIONS } from "../../config/appConfig";
import type { DivePlanDraft } from "../../domain/types";
import { AppButton } from "../components/AppButton";
import { InfoBox } from "../components/InfoBox";
import { NumberField } from "../components/NumberField";

interface PlanFormScreenProps {
  draft: DivePlanDraft;
  onChangeDraft: (partialDraft: Partial<DivePlanDraft>) => void;
  onGoToReview: () => void;
  onOpenHistory: () => void;
}

export function PlanFormScreen({
  draft,
  onChangeDraft,
  onGoToReview,
  onOpenHistory
}: PlanFormScreenProps) {
  const selectedUnit = UNIT_SYSTEM_OPTIONS.find(
    (option) => option.value === draft.unitSystem
  );

  const selectedScenario = SCENARIO_OPTIONS.find(
    (option) => option.value === draft.scenario
  );

  const requiresAltitude = selectedScenario?.requiresAltitude ?? false;

  return (
    <section className="screen">
      <h1>Nuevo plan</h1>

      <InfoBox
        tone="warning"
        title="v0.1 no operacional"
        message="Esta pantalla valida el flujo técnico inicial. No genera un plan de buceo real."
      />

      <h2>Sistema de unidades</h2>
      <div className="button-grid">
        {UNIT_SYSTEM_OPTIONS.map((option) => (
          <AppButton
            key={option.value}
            label={option.label}
            variant={draft.unitSystem === option.value ? "primary" : "secondary"}
            onClick={() => onChangeDraft({ unitSystem: option.value })}
          />
        ))}
      </div>

      <h2>Escenario</h2>
      <div className="button-grid">
        {SCENARIO_OPTIONS.map((option) => (
          <AppButton
            key={option.value}
            label={option.label}
            variant={draft.scenario === option.value ? "primary" : "secondary"}
            onClick={() => onChangeDraft({ scenario: option.value })}
          />
        ))}
      </div>

      <NumberField
        label={`Profundidad (${selectedUnit?.depthLabel ?? "unidad"})`}
        value={draft.depthValue}
        placeholder="Ej: 12"
        onChange={(value) => onChangeDraft({ depthValue: value })}
      />

      <NumberField
        label="Tiempo de fondo planificado (min)"
        value={draft.plannedBottomTimeMinutes}
        placeholder="Ej: 20"
        onChange={(value) => onChangeDraft({ plannedBottomTimeMinutes: value })}
      />

      {requiresAltitude && (
        <div className="altitude-panel">
          <h2>Altitud</h2>

          <div className="button-grid">
            <AppButton
              label="Manual"
              variant={draft.altitudeSource === "manual" ? "primary" : "secondary"}
              onClick={() => onChangeDraft({ altitudeSource: "manual" })}
            />

            <AppButton
              label="GPS estimado"
              variant={
                draft.altitudeSource === "gps_estimated" ? "primary" : "secondary"
              }
              onClick={() => onChangeDraft({ altitudeSource: "gps_estimated" })}
            />
          </div>

          <NumberField
            label={`Altitud (${selectedUnit?.altitudeLabel ?? "unidad"})`}
            value={draft.altitudeValue}
            placeholder="Ej: 500"
            onChange={(value) => onChangeDraft({ altitudeValue: value })}
          />

          <AppButton
            label={
              draft.altitudeConfirmed
                ? "Altitud confirmada"
                : "Confirmar altitud manualmente"
            }
            variant={draft.altitudeConfirmed ? "primary" : "secondary"}
            onClick={() => onChangeDraft({ altitudeConfirmed: !draft.altitudeConfirmed })}
          />

          <InfoBox
            tone="warning"
            message="Para escenarios que no son mar, v0.1 exige confirmar la altitud, pero bloquea el cálculo operativo hasta validar ESLD/tablas."
          />
        </div>
      )}

      <h2>Gas</h2>
      <AppButton label="Aire" variant="primary" onClick={() => onChangeDraft({ gas: "air" })} />

      <div className="actions">
        <AppButton label="Revisar plan" onClick={onGoToReview} />
        <AppButton label="Ver historial local" variant="secondary" onClick={onOpenHistory} />
      </div>
    </section>
  );
}
