import {
  ALTITUDE_SOURCE_OPTIONS,
  APP_COPY,
  DEPTH_SOURCE_OPTIONS,
  UNIT_SYSTEM_OPTIONS,
  WATER_TYPE_OPTIONS
} from "../../domain/dive-planning/constants";
import type { PreliminaryDivePlan } from "../../domain/dive-planning/types";
import { NoticeBox } from "../components/NoticeBox";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StepHeader } from "../components/StepHeader";
import { SummaryCard } from "../components/SummaryCard";

function formatAltitude(plan: PreliminaryDivePlan): { value: string; detail: string } {
  if (plan.waterType === "saltwater") {
    return {
      value: "No requerida por defecto",
      detail: "MVP visual basado en operación marítima / agua salada."
    };
  }

  if (plan.waterType !== "freshwater") {
    return {
      value: "Sin definir",
      detail: "Seleccioná tipo de agua para determinar si aplica altitud."
    };
  }

  if (plan.altitudeSource === "manual") {
    return {
      value:
        plan.altitudeValue === null
          ? "Manual sin valor"
          : `${plan.altitudeValue} ${plan.altitudeUnit}`,
      detail: plan.altitudeConfirmed
        ? "Altitud preliminar confirmada. Requiere validación profesional futura."
        : "Altitud manual pendiente de confirmación."
    };
  }

  if (plan.altitudeSource === "gps_estimated") {
    return {
      value: "GPS pendiente",
      detail: "Función preparada para fase posterior. Debe mostrarse como estimación."
    };
  }

  return {
    value: "Pendiente",
    detail: "En agua dulce deberá confirmarse antes de usar tablas reales."
  };
}

export function PreliminarySummaryScreen({
  plan,
  onEdit,
  onNewPlan
}: {
  plan: PreliminaryDivePlan;
  onEdit: () => void;
  onNewPlan: () => void;
}) {
  const waterType = WATER_TYPE_OPTIONS.find((item) => item.id === plan.waterType);
  const unitSystem = UNIT_SYSTEM_OPTIONS.find((item) => item.id === plan.unitSystem);
  const depthSource = DEPTH_SOURCE_OPTIONS.find((item) => item.id === plan.depthSource);
  const altitudeSource = ALTITUDE_SOURCE_OPTIONS.find((item) => item.id === plan.altitudeSource);
  const altitude = formatAltitude(plan);

  return (
    <section className="screen">
      <StepHeader
        title="Resumen preliminar"
        subtitle="Datos base cargados. Requiere fase técnica posterior."
      />

      <NoticeBox
        tone="success"
        title="Plan preliminar creado"
        message="El flujo visual fue completado con la lógica simplificada: agua salada / agua dulce. Este resultado todavía no tiene cálculo técnico."
      />

      <div className="summary-grid">
        <SummaryCard
          title="Tipo de agua"
          value={waterType?.title ?? "Sin seleccionar"}
          detail={waterType?.description}
        />

        <SummaryCard
          title="Altitud"
          value={altitude.value}
          detail={`${altitude.detail}${altitudeSource ? ` Origen: ${altitudeSource.title}.` : ""}`}
        />

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
          detail="Pendiente: tiempo, tablas, NDL, altitud funcional validada y revisión profesional"
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
