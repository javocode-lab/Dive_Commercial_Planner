import type { RecreationalAirDiveInput } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import type { UnitSystem } from "../../../domain/dive-planner-core/shared/units";
import { DepthQuickSelect } from "../../components/DepthQuickSelect";
import { DepthStepper } from "../../components/DepthStepper";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";
import { UnitSystemCard } from "../../components/UnitSystemCard";
export type RecreationalPlanDraft = Pick<RecreationalAirDiveInput, "depth" | "bottomTime" | "unitSystem" | "gas">;
type RecreationalPlanScreenProps = { draft: RecreationalPlanDraft; onChange: (patch: Partial<RecreationalPlanDraft>) => void; onBack: () => void; onCalculate: () => void; };
const METRIC_DEPTH_OPTIONS = [9, 10.5, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39];
const IMPERIAL_DEPTH_OPTIONS = [30, 35, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130];
const TIME_OPTIONS = [5, 10, 12, 15, 20, 25, 30, 40, 55, 80, 150, 220, 250];
function getDepthUnit(unitSystem: UnitSystem): "m" | "ft" { return unitSystem === "metric" ? "m" : "ft"; }
function getDefaultDepth(unitSystem: UnitSystem): number { return unitSystem === "metric" ? 18 : 60; }
export function RecreationalPlanScreen({ draft, onChange, onBack, onCalculate }: RecreationalPlanScreenProps) {
  const depthUnit = getDepthUnit(draft.unitSystem); const depthOptions = draft.unitSystem === "metric" ? METRIC_DEPTH_OPTIONS : IMPERIAL_DEPTH_OPTIONS; const maxDepth = draft.unitSystem === "metric" ? 45 : 150; const depthStep = draft.unitSystem === "metric" ? 0.5 : 5; const canCalculate = draft.depth > 0 && draft.bottomTime > 0 && draft.gas === "air";
  const selectUnitSystem = (unitSystem: UnitSystem) => onChange({ unitSystem, depth: getDefaultDepth(unitSystem) });
  return <section className="screen"><StepHeader title="Plan recreativo con aire" subtitle="Ingresá profundidad y tiempo de fondo. El motor usa Tabla I y muestra trazabilidad en Detalle del cálculo." currentStep={1} totalSteps={4} onBack={onBack} />
    <div className="content-card"><h2>Sistema de unidades</h2><div className="stacked-options"><UnitSystemCard title="Métrico" description="Profundidad en metros" example="Ejemplo: 18 m" selected={draft.unitSystem === "metric"} onSelect={() => selectUnitSystem("metric")} /><UnitSystemCard title="Imperial" description="Profundidad en pies" example="Ejemplo: 60 ft" selected={draft.unitSystem === "imperial"} onSelect={() => selectUnitSystem("imperial")} /></div></div>
    <div className="content-card"><h2>Profundidad</h2><DepthStepper value={draft.depth} unit={depthUnit} step={depthStep} min={depthStep} max={maxDepth} onChange={(depth) => onChange({ depth })} /><DepthQuickSelect options={depthOptions} selectedValue={draft.depth} unit={depthUnit} onSelect={(depth) => onChange({ depth })} /></div>
    <div className="content-card"><h2>Tiempo de fondo</h2><label className="field"><span>Tiempo de fondo en minutos</span><input inputMode="numeric" min="1" value={String(draft.bottomTime)} onChange={(event) => { const nextValue = Number(event.target.value); onChange({ bottomTime: Number.isFinite(nextValue) ? nextValue : 0 }); }} /></label><div className="quick-select-grid quick-select-grid--dense">{TIME_OPTIONS.map((time) => <button key={time} className={draft.bottomTime === time ? "quick-select-chip quick-select-chip--selected" : "quick-select-chip"} type="button" onClick={() => onChange({ bottomTime: time })}>{time} min</button>)}</div></div>
    <div className="content-card content-card--compact"><span>Gas</span><strong>Aire</strong><small>Otros gases quedan fuera del alcance de esta versión.</small></div>
    <NoticeBox tone="warning" title="Planificación asistida" message="Este resultado no autoriza una inmersión. Debe compararse manualmente con criterio profesional, tablas oficiales y procedimientos aplicables." />
    <PrimaryActionBar secondaryLabel="Inicio" primaryLabel="Calcular" primaryDisabled={!canCalculate} onSecondary={onBack} onPrimary={onCalculate} /></section>;
}
