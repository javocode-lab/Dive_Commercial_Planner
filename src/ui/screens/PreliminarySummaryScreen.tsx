import {
  APP_COPY,
  DEPTH_SOURCE_OPTIONS,
  PORT_TYPE_OPTIONS,
  SCENARIO_OPTIONS,
  UNIT_SYSTEM_OPTIONS
} from "../../domain/dive-planning/constants";
import type { PreliminaryDivePlan } from "../../domain/dive-planning/types";
import { NoticeBox } from "../components/NoticeBox";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StepHeader } from "../components/StepHeader";
import { SummaryCard } from "../components/SummaryCard";

type PreliminarySummaryScreenProps = {
  plan: PreliminaryDivePlan;
  onEdit: () => void;
  onNewPlan: () => void;
};

export function PreliminarySummaryScreen({
  plan,
  onEdit,
  onNewPlan
}: PreliminarySummaryScreenProps) {
  const scenario = SCENARIO_OPTIONS.find((item) => item.id === plan.scenario);
  const unitSystem = UNIT_SYSTEM_OPTIONS.find((item) => item.id === plan.unitSystem);
  const depthSource = DEPTH_SOURCE_OPTIONS.find((item) => item.id === plan.depthSource);
  const portType = PORT_TYPE_OPTIONS.find((item) => item.id === plan.portType);

  return (
    <section className="screen">
      <StepHeader
        title="Resumen preliminar"
        subtitle="Datos base cargados. Requiere fase técnica posterior."
      />

      <NoticeBox
        tone="success"
        title="Plan preliminar creado"
        message="El flujo visual fue completado. Este resultado todavía no tiene cálculo técnico."
      />

      <div className="summary-grid">
        <SummaryCard
          title="Escenario"
          value={scenario?.title ?? "Sin seleccionar"}
          detail={
            scenario?.requiresAltitudeLater
              ? "Requiere altitud en fase posterior"
              : "No requiere altitud por defecto en este MVP"
          }
        />

        {plan.scenario === "port" && (
          <SummaryCard
            title="Tipo de puerto"
            value={portType?.title ?? "Sin definir"}
            detail={portType?.description}
          />
        )}

        <SummaryCard
          title="Sistema de unidades"
          value={unitSystem?.title ?? "Sin definir"}
          detail={unitSystem?.example}
        />

        <SummaryCard
          title="Profundidad planificada"
          value={
            plan.plannedDepth === null
              ? "Sin definir"
              : `${plan.plannedDepth} ${plan.depthUnit}`
          }
          detail={`Fuente: ${depthSource?.title ?? "Sin identificar"}`}
        />

        <SummaryCard
          title="Confirmación operativa"
          value="Básica completa"
          detail="No equivale a autorización de inmersión"
        />

        <SummaryCard
          title="Estado del plan"
          value="Requiere fase técnica posterior"
          detail="Pendiente: tiempo, tablas, NDL, altitud funcional y validación profesional"
        />
      </div>

      <NoticeBox
        tone="critical"
        title="No operativo"
        message={`${APP_COPY.prototypeWarning} ${APP_COPY.operationalWarning}`}
      />

      <PrimaryActionBar
        secondaryLabel="Editar"
        primaryLabel="Nuevo plan"
        onSecondary={onEdit}
        onPrimary={onNewPlan}
      />
    </section>
  );
}
