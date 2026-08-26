import type { RecreationalAirDiveResult } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";
const CATEGORY_LABELS: Record<string, string> = { input: "1. Datos ingresados", conversion: "2. Conversión y normalización", validation: "3. Validaciones", rounding: "4. Redondeos aplicados", lookup: "5. Búsqueda en tabla", comparison: "6. Cálculo", result: "7. Resultado", source: "8. Fuente técnica" };
const CATEGORY_ORDER = ["input", "conversion", "validation", "rounding", "lookup", "comparison", "result", "source"];
type Props = { result: RecreationalAirDiveResult; onBack: () => void; onValidate: () => void; };
export function CalculationDetailScreen({ result, onBack, onValidate }: Props) { return <section className="screen"><StepHeader title="Detalle del cálculo" subtitle="Procedimiento auditable generado por el motor. Esta vista debe ser revisada manualmente antes de cualquier decisión operativa." currentStep={3} totalSteps={4} onBack={onBack} />
  <NoticeBox tone="warning" title="Trazabilidad" message="La UI no reconstruye la explicación: muestra los pasos devueltos por el motor de cálculo." />
  {CATEGORY_ORDER.map((category) => { const steps = result.calculationSteps.filter((step) => step.category === category); if (steps.length === 0) return null; return <section className="content-card" key={category}><h2>{CATEGORY_LABELS[category]}</h2><div className="calculation-step-list">{steps.map((step, index) => <article className="calculation-step" key={step.id}><span>{index + 1}</span><div><strong>{step.title}</strong><p>{step.detail}</p></div></article>)}</div></section>; })}
  <section className="content-card content-card--compact"><span>Dataset</span><strong>{result.datasetVersion}</strong><small>Motor: {result.engineVersion}</small></section>
  <section className="content-card"><h2>Fuente técnica</h2><p>{result.sourceReference.name}</p><p>{result.sourceReference.table}</p><p>{result.sourceReference.validationStatus}</p></section>
  <PrimaryActionBar secondaryLabel="Resultado" primaryLabel="Validación manual" onSecondary={onBack} onPrimary={onValidate} /></section>; }
