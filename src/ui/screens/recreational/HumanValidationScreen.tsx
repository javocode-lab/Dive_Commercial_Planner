import { useMemo, useState } from "react";
import type { RecreationalAirDiveResult } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { ChecklistItem } from "../../components/ChecklistItem";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";
type ValidationKey = "inputReviewed" | "conversionsReviewed" | "rulesReviewed" | "resultReviewed" | "warningsReviewed" | "notAuthorizationAccepted";
type Props = { result: RecreationalAirDiveResult; onBack: () => void; onNewPlan: () => void; };
const ITEMS: { key: ValidationKey; label: string; description: string }[] = [
  { key: "inputReviewed", label: "Datos revisados", description: "Profundidad, tiempo, gas y sistema de unidades fueron comparados con el plan real." },
  { key: "conversionsReviewed", label: "Conversiones y redondeos revisados", description: "La profundidad efectiva y el redondeo hacia arriba fueron revisados manualmente." },
  { key: "rulesReviewed", label: "Reglas revisadas", description: "Se confirmó el uso de Tabla I, aire, inmersión simple y tiempo exacto contra límite." },
  { key: "resultReviewed", label: "Resultado revisado", description: "El límite, tiempo usado y tiempo restante fueron comparados con criterio profesional." },
  { key: "warningsReviewed", label: "Advertencias revisadas", description: "Se revisaron bloqueos, excesos, margen bajo o fuera de alcance." },
  { key: "notAuthorizationAccepted", label: "No representa autorización automática", description: "La validación de esta pantalla no autoriza por sí sola una inmersión." }
];
export function HumanValidationScreen({ result, onBack, onNewPlan }: Props) { const [checks, setChecks] = useState<Record<ValidationKey, boolean>>({ inputReviewed: false, conversionsReviewed: false, rulesReviewed: false, resultReviewed: false, warningsReviewed: false, notAuthorizationAccepted: false }); const isComplete = useMemo(() => Object.values(checks).every(Boolean), [checks]); const toggle = (key: ValidationKey) => setChecks((current) => ({ ...current, [key]: !current[key] })); return <section className="screen"><StepHeader title="Validación manual" subtitle="Checklist de revisión. No equivale a autorización automática de inmersión." currentStep={4} totalSteps={4} onBack={onBack} />
  <NoticeBox tone={isComplete ? "success" : "warning"} title={isComplete ? "Checklist completo" : "Checklist pendiente"} message={isComplete ? "La revisión manual fue marcada como completa, pero la decisión operacional sigue fuera de la app." : "Wili o el responsable debe revisar todos los puntos antes de considerar el resultado como verificado."} />
  <div className="checklist-stack">{ITEMS.map((item) => <ChecklistItem key={item.key} label={item.label} description={item.description} checked={checks[item.key]} onToggle={() => toggle(item.key)} />)}</div>
  <section className="content-card content-card--compact"><span>Estado técnico</span><strong>{result.resultLabel}</strong><small>Dataset: {result.datasetVersion}</small></section>
  <PrimaryActionBar secondaryLabel="Detalle del cálculo" primaryLabel="Nuevo plan" onSecondary={onBack} onPrimary={onNewPlan} /></section>; }
