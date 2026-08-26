import { APP_COPY } from "../../domain/dive-planning/constants";
import { NoticeBox } from "../components/NoticeBox";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StepHeader } from "../components/StepHeader";

export function NewPlanIntroScreen({
  onBack,
  onContinue
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="screen">
      <StepHeader
        title="Crear plan preliminar"
        subtitle="En esta fase se cargan datos base. No se ejecutan tablas ni cálculos técnicos."
        currentStep={0}
        totalSteps={4}
        onBack={onBack}
      />

      <div className="content-card">
        <h2>Este MVP visual permite cargar:</h2>
        <ul className="clean-list">
          <li>✓ Tipo de agua: salada o dulce</li>
          <li>✓ Altitud preliminar solo cuando aplica agua dulce</li>
          <li>✓ Sistema de unidades</li>
          <li>✓ Profundidad planificada</li>
          <li>✓ Confirmación operativa básica</li>
        </ul>
      </div>

      <NoticeBox
        tone="success"
        title="Cambio v0.3"
        message="El flujo se simplificó a agua salada / agua dulce para que sea más rápido de validar en campo."
      />

      <NoticeBox
        tone="warning"
        title="Fase técnica pendiente"
        message={APP_COPY.prototypeWarning}
      />

      <PrimaryActionBar
        secondaryLabel="Atrás"
        primaryLabel="Comenzar"
        onSecondary={onBack}
        onPrimary={onContinue}
      />
    </section>
  );
}
