import type { ChangeEvent } from "react";
import { useI18n } from "../../../i18n/I18nProvider";
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
  const { copy } = useI18n();
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
        title={copy.plan.title}
        subtitle={copy.plan.subtitle}
        currentStep={1}
        totalSteps={4}
        onBack={onBack}
      />

      <div className="content-card">
        <h2>{copy.plan.unitsTitle}</h2>
        <div className="stacked-options">
          <UnitSystemCard
            title={copy.common.metric}
            description={copy.plan.metricDescription}
            example={copy.plan.metricExample}
            selected={draft.unitSystem === "metric"}
            onSelect={() => selectUnitSystem("metric")}
          />
          <UnitSystemCard
            title={copy.common.imperial}
            description={copy.plan.imperialDescription}
            example={copy.plan.imperialExample}
            selected={draft.unitSystem === "imperial"}
            onSelect={() => selectUnitSystem("imperial")}
          />
        </div>
      </div>

      <div className="content-card">
        <h2>{copy.plan.firstDive}</h2>
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
          label={copy.plan.firstBottomTime}
          helper={copy.plan.bottomTimeHelper}
          valueMinutes={draft.bottomTime}
          minMinutes={1}
          maxMinutes={720}
          quickOptions={TIME_OPTIONS}
          allowEmpty
          placeholder="01:30"
          onChange={(bottomTime) => onChange({ bottomTime })}
        />
      </div>

      <div className="content-card">
        <h2>{copy.plan.planningType}</h2>
        <div className="stacked-options">
          <button
            className={draft.isRepetitive ? "wide-card" : "wide-card wide-card--selected"}
            type="button"
            onClick={() => onChange({ isRepetitive: false })}
          >
            <span className="radio-mark">{!draft.isRepetitive ? "✓" : ""}</span>
            <span>
              <strong>{copy.plan.simpleDive}</strong>
              <small>{copy.plan.simpleDiveDescription}</small>
            </span>
          </button>
          <button
            className={draft.isRepetitive ? "wide-card wide-card--selected" : "wide-card"}
            type="button"
            onClick={() => onChange({ isRepetitive: true })}
          >
            <span className="radio-mark">{draft.isRepetitive ? "✓" : ""}</span>
            <span>
              <strong>{copy.plan.repetitiveDive}</strong>
              <small>{copy.plan.repetitiveDiveDescription}</small>
            </span>
          </button>
        </div>
      </div>

      {draft.isRepetitive && (
        <div className="content-card repetitive-card">
          <h2>{copy.plan.repetitiveDive}</h2>
          <NoticeBox
            tone="warning"
            title={copy.plan.newDataTitle}
            message={copy.plan.newDataMessage}
          />

          <DurationInput
            label={copy.plan.surfaceInterval}
            helper={copy.plan.surfaceIntervalHelper}
            valueMinutes={draft.surfaceIntervalMinutes}
            minMinutes={1}
            maxMinutes={720}
            quickOptions={SURFACE_INTERVAL_OPTIONS}
            onChange={(surfaceIntervalMinutes) => onChange({ surfaceIntervalMinutes })}
          />

          <div className="repetitive-subsection">
            <h3>{copy.plan.secondDive}</h3>
            <label className="field">
              <span>{copy.plan.secondDepth} ({depthUnit})</span>
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
              label={copy.plan.secondBottomTime}
              helper={copy.plan.secondBottomTimeHelper}
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
        <strong>{copy.common.air}</strong>
        <small>{copy.plan.gasScope}</small>
      </div>

      <NoticeBox
        tone="warning"
        title={copy.plan.safetyTitle}
        message={copy.plan.safetyMessage}
      />

      <PrimaryActionBar
        secondaryLabel={copy.common.home}
        primaryLabel={copy.common.calculate}
        primaryDisabled={!canCalculate}
        onSecondary={onBack}
        onPrimary={onCalculate}
      />
    </section>
  );
}
