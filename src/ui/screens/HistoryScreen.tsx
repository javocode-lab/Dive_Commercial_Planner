import type { HistoryItem } from "../../domain/types";
import { formatMeters, formatMinutes } from "../../domain/units";
import { AppButton } from "../components/AppButton";
import { InfoBox } from "../components/InfoBox";

interface HistoryScreenProps {
  history: HistoryItem[];
  onBack: () => void;
  onClearHistory: () => void;
}

export function HistoryScreen({
  history,
  onBack,
  onClearHistory
}: HistoryScreenProps) {
  return (
    <section className="screen">
      <h1>Historial local</h1>

      <InfoBox
        tone="warning"
        message="El historial es local del navegador y guarda planes mock de desarrollo."
      />

      {history.length === 0 ? (
        <InfoBox message="Todavía no hay planes guardados." />
      ) : (
        history.map((item) => (
          <div key={item.id} className="card">
            <strong>{new Date(item.createdAt).toLocaleString()}</strong>
            <p>Escenario: {item.scenario}</p>
            <p>Profundidad: {formatMeters(item.depthMeters)}</p>
            <p>Tiempo: {formatMinutes(item.plannedBottomTimeMinutes)}</p>
            <p>Estado: {item.status}</p>
          </div>
        ))
      )}

      <div className="actions">
        <AppButton label="Volver" variant="secondary" onClick={onBack} />
        <AppButton label="Limpiar historial" variant="danger" onClick={onClearHistory} />
      </div>
    </section>
  );
}
