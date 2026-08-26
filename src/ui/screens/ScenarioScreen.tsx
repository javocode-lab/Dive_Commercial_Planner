import {
  ALTITUDE_SOURCE_OPTIONS,
  WATER_TYPE_OPTIONS
} from "../../domain/dive-planning/constants";
import type {
  AltitudeSource,
  PreliminaryDivePlan,
  WaterType
} from "../../domain/dive-planning/types";
import { NoticeBox } from "../components/NoticeBox";
import { NumberField } from "../components/NumberField";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { ScenarioCard } from "../components/ScenarioCard";
import { StepHeader } from "../components/StepHeader";

const altitudeToInputValue = (value: number | null) => {
  return value === null ? "" : String(value);
};

const parseAltitudeValue = (rawValue: string) => {
  const normalizedValue = rawValue.replace(",", ".").trim();

  if (normalizedValue.length === 0) {
    return null;
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
};

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
  const selectedWaterType = WATER_TYPE_OPTIONS.find((item) => item.id === plan.waterType);
  const isFreshwater = plan.waterType === "freshwater";
  const isManualAltitude = plan.altitudeSource === "manual";
  const hasInvalidManualAltitude =
    isFreshwater &&
    isManualAltitude &&
    (plan.altitudeValue === null || plan.altitudeValue < 0 || !plan.altitudeConfirmed);
  const canContinue = plan.waterType !== null && !hasInvalidManualAltitude;

  const selectWaterType = (waterType: WaterType) => {
    onChange({
      waterType,
      scenario: null,
      portType: null,
      altitudeSource: waterType === "freshwater" ? "pending" : "not_required",
      altitudeValue: null,
      altitudeConfirmed: false,
      status: "in_progress"
    });
  };

  const selectAltitudeSource = (altitudeSource: AltitudeSource) => {
    onChange({
      altitudeSource,
      altitudeValue: altitudeSource === "manual" ? plan.altitudeValue : null,
      altitudeConfirmed: false,
      status: "in_progress"
    });
  };

  return (
    <section className="screen">
      <StepHeader
        title="Tipo de agua"
        subtitle="Simplificamos el inicio: primero definí si la operación es en agua salada o dulce."
        currentStep={1}
        totalSteps={4}
        onBack={onBack}
      />

      <div className="scenario-grid scenario-grid--simple">
        {WATER_TYPE_OPTIONS.map((waterType) => (
          <ScenarioCard
            key={waterType.id}
            icon={waterType.icon}
            title={waterType.title}
            description={waterType.description}
            selected={plan.waterType === waterType.id}
            onSelect={() => selectWaterType(waterType.id)}
          />
        ))}
      </div>

      {selectedWaterType && (
        <NoticeBox
          tone={isFreshwater ? "warning" : "info"}
          title={isFreshwater ? "Altitud para agua dulce" : "Altitud no requerida por defecto"}
          message={
            isFreshwater
              ? "Para agua dulce la altitud debe contemplarse antes de usar tablas o límites técnicos. En esta versión se registra como dato preliminar."
              : "Para agua salada se asume operación marítima a nivel del mar dentro de este MVP visual, salvo revisión especial futura."
          }
        />
      )}

      {isFreshwater && (
        <section className="content-card">
          <h2>Altitud del sitio</h2>
          <p>
            La altitud todavía no se usa para calcular. Queda registrada para preparar la fase técnica.
          </p>

          <div className="stacked-options">
            {ALTITUDE_SOURCE_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={
                  plan.altitudeSource === option.id ? "wide-card wide-card--selected" : "wide-card"
                }
                type="button"
                onClick={() => selectAltitudeSource(option.id)}
              >
                <span className="radio-mark">{plan.altitudeSource === option.id ? "●" : "○"}</span>
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
              </button>
            ))}
          </div>

          {isManualAltitude && (
            <div className="altitude-panel">
              <NumberField
                label={`Altitud preliminar (${plan.altitudeUnit})`}
                value={altitudeToInputValue(plan.altitudeValue)}
                placeholder={plan.altitudeUnit === "m" ? "Ej: 740" : "Ej: 2400"}
                onChange={(value) =>
                  onChange({
                    altitudeValue: parseAltitudeValue(value),
                    altitudeConfirmed: false,
                    status: "in_progress"
                  })
                }
              />

              <button
                className={plan.altitudeConfirmed ? "wide-card wide-card--selected" : "wide-card"}
                type="button"
                onClick={() =>
                  onChange({
                    altitudeConfirmed: !plan.altitudeConfirmed,
                    status: "in_progress"
                  })
                }
              >
                <span className="radio-mark">{plan.altitudeConfirmed ? "✓" : ""}</span>
                <span>
                  <strong>Confirmar altitud preliminar</strong>
                  <small>
                    Este dato deberá validarse profesionalmente antes de usar tablas reales.
                  </small>
                </span>
              </button>
            </div>
          )}

          {plan.altitudeSource === "gps_estimated" && (
            <NoticeBox
              tone="warning"
              title="GPS pendiente"
              message="La lectura por GPS queda preparada para una versión posterior. Cuando se active, deberá mostrarse como altitud estimada y confirmada por el responsable."
            />
          )}
        </section>
      )}

      {hasInvalidManualAltitude && (
        <NoticeBox
          tone="warning"
          title="Falta confirmar altitud"
          message="Si cargás altitud manual en agua dulce, ingresá un valor válido y marcá la confirmación preliminar para continuar."
        />
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
