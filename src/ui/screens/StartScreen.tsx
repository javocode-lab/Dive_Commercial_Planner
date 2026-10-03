import { APP_COPY } from "../../domain/dive-planning/constants";
import { useI18n } from "../../i18n/I18nProvider";
import { NoticeBox } from "../components/NoticeBox";

type StartScreenProps = { onStart: () => void; onDemo: () => void };

export function StartScreen({ onStart, onDemo }: StartScreenProps) {
  const { copy } = useI18n();

  return (
    <section className="screen screen--hero">
      <div className="brand-block">
        <span className="eyebrow">{copy.start.eyebrow}</span>
        <h1>{APP_COPY.productName}</h1>
        <p className="brand-subtitle">{copy.start.subtitle}</p>
      </div>

      <NoticeBox tone="critical" title={copy.start.safetyTitle} message={copy.start.safetyMessage} />

      <div className="content-card">
        <h2>{copy.start.allowsTitle}</h2>
        <ul className="clean-list">
          {copy.start.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
        </ul>
      </div>

      <div className="hero-actions">
        <button className="primary-button primary-button--large" type="button" onClick={onStart}>{copy.start.startButton}</button>
        <button className="secondary-button secondary-button--large" type="button" onClick={onDemo}>{copy.start.demoButton}</button>
      </div>
    </section>
  );
}
