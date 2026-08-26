import { APP_CONFIG } from "../../config/appConfig";
import { MESSAGES } from "../../config/messages";
import { AppButton } from "../components/AppButton";
import { InfoBox } from "../components/InfoBox";

interface SafetyGateScreenProps {
  onAccept: () => void;
}

export function SafetyGateScreen({ onAccept }: SafetyGateScreenProps) {
  return (
    <section className="screen screen--centered">
      <p className="eyebrow">{APP_CONFIG.safetyStatus}</p>
      <h1>{APP_CONFIG.name}</h1>
      <p className="version">v{APP_CONFIG.version}</p>

      <InfoBox
        tone="critical"
        title={MESSAGES.safetyTitle}
        message={MESSAGES.safetyBody}
      />

      <InfoBox
        tone="warning"
        title="Pendiente de validación"
        message="Antes de usar datos reales se deben validar fuente normativa, fórmulas, tablas, límites, redondeos, altitud y criterios operativos con personal competente."
      />

      <AppButton label={MESSAGES.acceptedLabel} onClick={onAccept} />
    </section>
  );
}
