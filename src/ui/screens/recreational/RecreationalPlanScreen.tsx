import type { ChangeEvent } from "react";
import type { RecreationalAirDiveInput } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import type { UnitSystem } from "../../../domain/dive-planner-core/shared/units";
import { DepthQuickSelect } from "../../components/DepthQuickSelect";
import { DepthStepper } from "../../components/DepthStepper";
import { DurationInput } from "../../components/DurationInput";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";
import { UnitSystemCard } from "../../components/UnitSystemCard";

export type RecreationalPlanDraft = {
  unitSystem: RecreationalAirDiveInput["unitSystem"];
  depth: number;
  bottomTime: number;
  gas: RecreationalAirDiveInput["gas"];
  isRepetitive: boolean;
  surfaceIntervalMinutes: number;
  secondDiveDepth: number;
  secondDiveBottomTime: number;
};

type RecreationalPlanScreenProps = {
  draft: RecreationalPlanDraft;
  onChange: (patch: Partial<RecreationalPlanDraft>) => void;
  onBack: () => void;
  onCalculate: () => void;
};

const METRIC_DEPTH_OPTIONS = [9, 10.5, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39];
const IMPERIAL_DEPTH_OPTIONS = [30, 35, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130];
const TIME_OPTIONS = [5, 10, 12, 15, 20, 25, 30, 40, 55, 80, 150, 220, 250];
const SECOND_TIME_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 55, 80];
const SURFACE_INTERVAL_OPTIONS = [10, 30, 45, 60, 90, 120, 180, 240, 360, 480, 600, 720];

function getDepthUnit(unitSystem: UnitSystem): "m" | "ft" {
  return unitSystem === "metric" ? "m" : "ft";
}

function getDefaultDepth(unitSystem: UnitSystem): number {
  return unitSystem === "metric" ? 18 : 60;
}

function getDefaultSecondDiveDepth(unitSystem: UnitSystem): number {
  return unitSystem === "metric" ? 15 : 50;
}

function safeNumber(value: string): number {
  const nextValue = Number(value);
  return Number.isFinite(nextValue) ? nextValue : 0;
}

export function RecreationalPlanScreen({ draft, onChange, onBack, onCalculate }: RecreationalPlanScreenProps) {
  const depthUnit = getDepthUnit(draft.unitSystem);
  const depthOptions = draft.unitSystem === "metric" ? METRIC_DEPTH_OPTIONS : IMPERIAL_DEPTH_OPTIONS;
  const maxDepth = draft.unitSystem === "metric" ? 45 : 150;
  const depthStep = draft.unitSystem === "metric" ? 0.5 : 5;
  const canCalculate =
    draft.depth > 0 &&
    draft.bottomTime > 0 &&
    draft.gas === "air" &&
    (!draft.isRepetitive ||
      (draft.surfaceIntervalMinutes > 0 && draft.secondDiveDepth > 0 && draft.secondDiveBottomTime > 0));

  const selectUnitSystem = (unitSystem: UnitSystem) =>
    onChange({
      unitSystem,
      depth: getDefaultDepth(unitSystem),
      secondDiveDepth: getDefaultSecondDiveDepth(unitSystem)
    });

  return (
    <section className="screen">
      <StepHeader
        title="Plan recreativo con aire"
        subtitle="Ingresá profundidad, tiempo de fondo y, si corresponde, datos de buceo repetitivo."
        currentStep={1}
        totalSteps={4}
        onBack={onBack}
      />

      <div className="content-card">
        <h2>Sistema de unidades</h2>
        <div className="stacked-options">
          <UnitSystemCard
            title="Métrico"
            description="Profundidad en metros"
            example="Ejemplo: 18 m"
            selected={draft.unitSystem === "metric"}
            onSelect={() => selectUnitSystem("metric")}
          />
          <UnitSystemCard
            title="Imperial"
            description="Profundidad en pies"
            example="Ejemplo: 60 ft"
            selected={draft.unitSystem === "imperial"}
            onSelect={() => selectUnitSystem("imperial")}
          />
        </div>
      </div>

      <div className="content-card">
        <h2>Primera inmersión</h2>
        <DepthStepper
          value={draft.depth}
          unit={depthUnit}
          step={depthStep}
          min={depthStep}
          max={maxDepth}
          onChange={(depth) => onChange({ depth })}
        />
        <DepthQuickSelect options={depthOptions} selectedValue={draft.depth} unit={depthUnit} onSelect={(depth) => onChange({ depth })} />
        <DurationInput
          label="Tiempo de fondo — primera inmersión"
          helper="Duración utilizada para el cálculo tabular."
          valueMinutes={draft.bottomTime}
          minMinutes={1}
          maxMinutes={720}
          quickOptions={TIME_OPTIONS}
          onChange={(bottomTime) => onChange({ bottomTime })}
        />
      </div>

      <div className="content-card">
        <h2>Tipo de planificación</h2>
        <div className="stacked-options">
          <button
            className={draft.isRepetitive ? "wide-card" : "wide-card wide-card--selected"}
            type="button"
            onClick={() => onChange({ isRepetitive: false })}
          >
            <span className="radio-mark">{!draft.isRepetitive ? "✓" : ""}</span>
            <span>
              <strong>Inmersión simple</strong>
              <small>Calcula Tabla I, límite sin descompresión y grupo final.</small>
            </span>
          </button>
          <button
            className={draft.isRepetitive ? "wide-card wide-card--selected" : "wide-card"}
            type="button"
            onClick={() => onChange({ isRepetitive: true })}
          >
            <span className="radio-mark">{draft.isRepetitive ? "✓" : ""}</span>
            <span>
              <strong>Buceo repetitivo</strong>
              <small>Agrega intervalo en superficie, segunda inmersión y nitrógeno residual en minutos.</small>
            </span>
          </button>
        </div>
      </div>

      {draft.isRepetitive && (
        <div className="content-card repetitive-card">
          <h2>Buceo repetitivo</h2>
          <NoticeBox
            tone="warning"
            title="Dato nuevo requerido"
            message="Ingresá cuánto tiempo permaneció fuera del agua el buzo entre la primera y la segunda inmersión."
          />

          <DurationInput
            label="Tiempo fuera del agua"
            helper="Intervalo en superficie entre la primera y la segunda inmersión."
            valueMinutes={draft.surfaceIntervalMinutes}
            minMinutes={1}
            maxMinutes={720}
            quickOptions={SURFACE_INTERVAL_OPTIONS}
            onChange={(surfaceIntervalMinutes) => onChange({ surfaceIntervalMinutes })}
          />

          <div className="repetitive-subsection">
            <h3>Segunda inmersión</h3>
            <label className="field">
              <span>Profundidad planificada de la segunda inmersión ({depthUnit})</span>
              <input
                inputMode="decimal"
                min="1"
                value={String(draft.secondDiveDepth)}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({ secondDiveDepth: safeNumber(event.target.value) })}
              />
            </label>
            <DepthQuickSelect
              options={depthOptions}
              selectedValue={draft.secondDiveDepth}
              unit={depthUnit}
              onSelect={(secondDiveDepth) => onChange({ secondDiveDepth })}
            />
            <DurationInput
              label="Tiempo de fondo — segunda inmersión"
              helper="Duración planificada para la segunda inmersión."
              valueMinutes={draft.secondDiveBottomTime}
              minMinutes={1}
              maxMinutes={720}
              quickOptions={SECOND_TIME_OPTIONS}
              onChange={(secondDiveBottomTime) => onChange({ secondDiveBottomTime })}
            />
          </div>
        </div>
      )}

      <div className="content-card content-card--compact">
        <span>Gas</span>
        <strong>Aire</strong>
        <small>Otros gases quedan fuera del alcance de esta versión.</small>
      </div>

      <NoticeBox
        tone="warning"
        title="Planificación asistida"
        message="Este resultado no autoriza una inmersión. Debe compararse manualmente con criterio profesional, tablas oficiales y procedimientos aplicables."
      />

      <PrimaryActionBar
        secondaryLabel="Inicio"
        primaryLabel="Calcular"
        primaryDisabled={!canCalculate}
        onSecondary={onBack}
        onPrimary={onCalculate}
      />
    </section>
  );
}
