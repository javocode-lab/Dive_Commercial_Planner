import { APP_COPY } from "../../domain/dive-planning/constants";
import { NoticeBox } from "../components/NoticeBox";
import { PrimaryActionBar } from "../components/PrimaryActionBar";
import { StepHeader } from "../components/StepHeader";

type NewPlanIntroScreenProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function NewPlanIntroScreen({ onBack, onContinue }: NewPlanIntroScreenProps) {
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
          <li>✓ Escenario de operación</li>
          <li>✓ Sistema de unidades</li>
          <li>✓ Profundidad planificada</li>
          <li>✓ Confirmación operativa básica</li>
        </ul>
      </div>

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
