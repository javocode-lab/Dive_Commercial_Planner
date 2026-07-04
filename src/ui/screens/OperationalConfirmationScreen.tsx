import {
  derivePreliminaryPlanStatus,
  isOperationalConfirmationComplete
} from "../../domain/dive-planning/preliminaryPlan";
import type { OperationalConfirmation, PreliminaryDivePlan } from "../../domain/dive-planning/types";
import { ChecklistItem } from "../components/ChecklistItem";
import { NoticeBox } from "../components/NoticeBox";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StepHeader } from "../components/StepHeader";

type OperationalConfirmationScreenProps = {
  plan: PreliminaryDivePlan;
  onBack: () => void;
  onFinish: () => void;
  onChange: (patch: Partial<PreliminaryDivePlan>) => void;
};

const CHECKLIST_ITEMS: {
  key: keyof OperationalConfirmation;
  label: string;
  description: string;
}[] = [
  {
    key: "scenarioReviewed",
    label: "Escenario revisado",
    description: "El entorno seleccionado representa la operación prevista."
  },
  {
    key: "unitSystemConfirmed",
    label: "Sistema de unidades correcto",
    description: "La profundidad se muestra en la unidad esperada."
  },
  {
    key: "depthReviewed",
    label: "Profundidad revisada",
    description: "La profundidad planificada fue revisada antes de continuar."
  },
  {
    key: "depthSourceIdentified",
    label: "Fuente de profundidad identificada",
    description: "Se registró de dónde proviene el dato."
  },
  {
    key: "supervisorResponsible",
    label: "Hay supervisor responsable",
    description: "El plan preliminar queda sujeto a revisión profesional."
  },
  {
    key: "prototypeDisclaimerAccepted",
    label: "Entiendo que este prototipo no autoriza una inmersión",
    description: "No reemplaza procedimientos, tablas ni autorización operativa."
  }
];

export function OperationalConfirmationScreen({
  plan,
  onBack,
  onFinish,
  onChange
}: OperationalConfirmationScreenProps) {
  const confirmation = plan.operationalConfirmation;
  const isComplete = isOperationalConfirmationComplete(confirmation);

  const toggleConfirmation = (key: keyof OperationalConfirmation) => {
    const nextConfirmation = {
      ...confirmation,
      [key]: !confirmation[key]
    };

    onChange({
      operationalConfirmation: nextConfirmation,
      status: derivePreliminaryPlanStatus({
        ...plan,
        operationalConfirmation: nextConfirmation
      })
    });
  };

  return (
    <section className="screen">
      <StepHeader
        title="Confirmación operativa"
        subtitle="Revisá estos puntos antes de cerrar el plan preliminar."
        currentStep={4}
        totalSteps={4}
        onBack={onBack}
      />

      <div className="checklist-stack">
        {CHECKLIST_ITEMS.map((item) => (
          <ChecklistItem
            key={item.key}
            label={item.label}
            description={item.description}
            checked={confirmation[item.key]}
            onToggle={() => toggleConfirmation(item.key)}
          />
        ))}
      </div>

      <NoticeBox
        tone={isComplete ? "success" : "warning"}
        title={isComplete ? "Confirmación básica completa" : "Confirmación incompleta"}
        message={
          isComplete
            ? "Podés generar el resumen preliminar."
            : "Faltan confirmaciones obligatorias para finalizar este MVP visual."
        }
      />

      <PrimaryActionBar
        secondaryLabel="Atrás"
        primaryLabel="Finalizar plan preliminar"
        primaryDisabled={!isComplete}
        onSecondary={onBack}
        onPrimary={onFinish}
      />
    </section>
  );
}
