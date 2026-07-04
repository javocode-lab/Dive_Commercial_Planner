import { APP_COPY } from "../../domain/dive-planning/constants";
import { NoticeBox } from "../components/NoticeBox";

type StartScreenProps = {
  onStart: () => void;
  onDemo: () => void;
};

export function StartScreen({ onStart, onDemo }: StartScreenProps) {
  return (
    <section className="screen screen--hero">
      <div className="brand-block">
        <span className="eyebrow">NON-OPERATIONAL PROTOTYPE</span>
        <h1>{APP_COPY.productName}</h1>
        <p>{APP_COPY.productSubtitle}</p>
      </div>

      <NoticeBox
        tone="critical"
        title="Uso no operativo"
        message={`${APP_COPY.prototypeWarning} ${APP_COPY.operationalWarning}`}
      />

      <div className="hero-actions">
        <button className="primary-button primary-button--large" type="button" onClick={onStart}>
          Iniciar nuevo plan
        </button>
        <button className="secondary-button secondary-button--large" type="button" onClick={onDemo}>
          Modo demostración
        </button>
      </div>
    </section>
  );
}
