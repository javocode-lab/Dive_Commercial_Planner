import { useMemo, useState } from "react";
import type { RecreationalAirDiveResult } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { ChecklistItem } from "../../components/ChecklistItem";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";

type ValidationKey =
  | "inputReviewed"
  | "conversionsReviewed"
  | "rulesReviewed"
  | "pressureGroupReviewed"
  | "surfaceIntervalReviewed"
  | "residualNitrogenReviewed"
  | "secondDiveReviewed"
  | "resultReviewed"
  | "warningsReviewed"
  | "notAuthorizationAccepted";

type Props = { result: RecreationalAirDiveResult; onBack: () => void; onNewPlan: () => void };

const ITEMS: { key: ValidationKey; label: string; description: string }[] = [
  { key: "inputReviewed", label: "Datos revisados", description: "Profundidad, tiempo, gas y sistema de unidades fueron comparados con el plan real." },
  { key: "conversionsReviewed", label: "Conversiones y redondeos revisados", description: "La profundidad efectiva y el redondeo hacia arriba fueron revisados manualmente." },
  { key: "rulesReviewed", label: "Reglas revisadas", description: "Se confirmó el uso de aire, Tabla I/II/III según corresponda y tiempo exacto contra límite." },
  { key: "pressureGroupReviewed", label: "Grupo de presión revisado", description: "Se revisó la letra final de Tabla I antes de usarla como entrada de repetitivas." },
  { key: "surfaceIntervalReviewed", label: "Intervalo en superficie revisado", description: "Se revisó el tiempo fuera del agua y el nuevo grupo calculado por Tabla II." },
  { key: "residualNitrogenReviewed", label: "Nitrógeno residual revisado", description: "Se revisó el tiempo de nitrógeno residual en minutos según Tabla III. No se interpreta como medición médica directa." },
  { key: "secondDiveReviewed", label: "Segunda inmersión revisada", description: "Se revisó profundidad efectiva, tiempo de fondo, límite ajustado y tiempo equivalente total." },
  { key: "resultReviewed", label: "Resultado revisado", description: "El límite, tiempo usado, tiempo restante y estado final fueron comparados con criterio profesional." },
  { key: "warningsReviewed", label: "Advertencias revisadas", description: "Se revisaron bloqueos, excesos, margen bajo o fuera de alcance." },
  { key: "notAuthorizationAccepted", label: "No representa autorización automática", description: "La validación de esta pantalla no autoriza por sí sola una inmersión." }
];

export function HumanValidationScreen({ result, onBack, onNewPlan }: Props) {
  const [checks, setChecks] = useState<Record<ValidationKey, boolean>>({
    inputReviewed: false,
    conversionsReviewed: false,
    rulesReviewed: false,
    resultReviewed: false,
    warningsReviewed: false,
    pressureGroupReviewed: false,
    surfaceIntervalReviewed: false,
    residualNitrogenReviewed: false,
    secondDiveReviewed: false,
    notAuthorizationAccepted: false
  });

  const isComplete = useMemo(() => Object.values(checks).every(Boolean), [checks]);
  const toggle = (key: ValidationKey) => setChecks((current) => ({ ...current, [key]: !current[key] }));

  return (
    <section className="screen">
      <StepHeader title="Validación manual" subtitle="Checklist de revisión. No equivale a autorización automática de inmersión." currentStep={4} totalSteps={4} onBack={onBack} />
      <NoticeBox
        tone={isComplete ? "success" : "warning"}
        title={isComplete ? "Checklist completo" : "Checklist pendiente"}
        message={isComplete ? "La revisión manual fue marcada como completa, pero la decisión operacional sigue fuera de la app." : "Wili o el responsable debe revisar todos los puntos antes de considerar el resultado como verificado."}
      />
      <div className="checklist-stack">
        {ITEMS.map((item) => (
          <ChecklistItem key={item.key} label={item.label} description={item.description} checked={checks[item.key]} onToggle={() => toggle(item.key)} />
        ))}
      </div>
      <section className="content-card content-card--compact">
        <span>Estado técnico</span>
        <strong>{result.resultLabel}</strong>
        <small>Dataset: {result.datasetVersion}</small>
      </section>
      <PrimaryActionBar secondaryLabel="Detalle del cálculo" primaryLabel="Nuevo plan" onSecondary={onBack} onPrimary={onNewPlan} />
    </section>
  );
}
