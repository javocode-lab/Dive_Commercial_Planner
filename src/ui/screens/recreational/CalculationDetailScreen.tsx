import type { CalculationStepCategory } from "../../../domain/dive-planner-core/shared/trace";
import type { RecreationalAirDiveResult } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";

type CalculationSectionMeta = {
  order: string;
  title: string;
  description: string;
};

const CATEGORY_META: Partial<Record<CalculationStepCategory, CalculationSectionMeta>> = {
  input: {
    order: "1",
    title: "Datos ingresados",
    description: "Valores originales recibidos por el motor antes de aplicar validaciones, conversiones o reglas.",
  },
  conversion: {
    order: "2",
    title: "Conversión y normalización",
    description: "Cómo se interpretó la profundidad según el sistema de unidades seleccionado.",
  },
  validation: {
    order: "3",
    title: "Validaciones",
    description: "Controles previos que determinan si el caso puede evaluarse con la tabla activa.",
  },
  rounding: {
    order: "4",
    title: "Redondeos aplicados",
    description: "Reglas conservadoras usadas para elegir la profundidad efectiva de tabla.",
  },
  lookup: {
    order: "5",
    title: "Búsqueda en tabla",
    description: "Fila/columna utilizada por el motor para recuperar el límite correspondiente.",
  },
  pressureGroup: {
    order: "6",
    title: "Grupo de presión final",
    description: "Base preparada para repetitivas. En esta versión se informa si la asignación de letra está disponible o pendiente de dataset.",
  },
  comparison: {
    order: "7",
    title: "Cálculo",
    description: "Comparación exacta entre tiempo de fondo ingresado y límite tabular encontrado.",
  },
  result: {
    order: "8",
    title: "Resultado",
    description: "Estado final producido por el motor y advertencias asociadas.",
  },
};

const CATEGORY_ORDER: CalculationStepCategory[] = [
  "input",
  "conversion",
  "validation",
  "rounding",
  "lookup",
  "pressureGroup",
  "comparison",
  "result",
];

type Props = {
  result: RecreationalAirDiveResult;
  onBack: () => void;
  onValidate: () => void;
};

function normalizeLabel(value: string): string {
  return value
    .replace(/^\d+\.\s*/, "")
    .trim()
    .toLocaleLowerCase("es-AR");
}

function splitDetail(detail: string): string[] {
  return detail
    .replace(/\.\s+/g, ".|")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function shouldShowStepTitle(stepTitle: string, categoryTitle: string): boolean {
  return normalizeLabel(stepTitle) !== normalizeLabel(categoryTitle);
}

export function CalculationDetailScreen({ result, onBack, onValidate }: Props) {
  return (
    <section className="screen">
      <StepHeader
        title="Detalle del cálculo"
        subtitle="Procedimiento auditable generado por el motor. Esta vista debe ser revisada manualmente antes de cualquier decisión operativa."
        currentStep={3}
        totalSteps={4}
        onBack={onBack}
      />

      <NoticeBox
        tone="warning"
        title="Trazabilidad"
        message="La UI no reconstruye la explicación: muestra los pasos devueltos por el motor de cálculo."
      />

      <div className="calculation-detail-stack">
        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category];
          if (!meta) return null;

          const steps = result.calculationSteps.filter((step) => step.category === category);
          if (steps.length === 0) return null;

          return (
            <section className="content-card calculation-section" key={category}>
              <header className="calculation-section__header">
                <span className="calculation-section__eyebrow">Paso {meta.order}</span>
                <h2>{meta.title}</h2>
                <p>{meta.description}</p>
              </header>

              <div className="calculation-step-list calculation-step-list--spacious">
                {steps.map((step, index) => {
                  const showTitle = shouldShowStepTitle(step.title, meta.title);
                  const detailLines = splitDetail(step.detail);

                  return (
                    <article
                      className={`calculation-step calculation-step--detail${steps.length > 1 ? " calculation-step--with-index" : ""}${showTitle ? "" : " calculation-step--no-title"}`}
                      key={step.id}
                    >
                      {steps.length > 1 ? <span className="calculation-step__index">{index + 1}</span> : null}

                      <div className="calculation-step__body">
                        {showTitle ? <strong>{step.title}</strong> : null}

                        <ul className="calculation-step__lines">
                          {detailLines.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="content-card calculation-source-card">
        <header className="calculation-section__header">
          <span className="calculation-section__eyebrow">Trazabilidad</span>
          <h2>Fuente técnica</h2>
          <p>Referencia conservada para auditoría del cálculo y revisión manual.</p>
        </header>

        <div className="calculation-source-grid">
          <div>
            <span>Fuente</span>
            <strong>{result.sourceReference.name}</strong>
          </div>
          <div>
            <span>Tabla utilizada</span>
            <strong>{result.sourceReference.table}</strong>
          </div>
          <div>
            <span>Versión / base</span>
            <strong>{result.sourceReference.version}</strong>
            <small>{result.sourceReference.basis}</small>
          </div>
          <div>
            <span>Dataset</span>
            <strong>{result.datasetVersion}</strong>
          </div>
          <div>
            <span>Motor</span>
            <strong>{result.engineVersion}</strong>
          </div>
          <div>
            <span>Validación</span>
            <strong>{result.sourceReference.validationStatus}</strong>
          </div>
        </div>
      </section>

      <PrimaryActionBar
        secondaryLabel="Resultado"
        primaryLabel="Validación manual"
        onSecondary={onBack}
        onPrimary={onValidate}
      />
    </section>
  );
}
