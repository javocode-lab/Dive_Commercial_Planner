import { APP_COPY } from "../../domain/dive-planning/constants";
import { NoticeBox } from "../components/NoticeBox";
type StartScreenProps = { onStart: () => void; onDemo: () => void; };
export function StartScreen({ onStart, onDemo }: StartScreenProps) {
  return <section className="screen screen--hero"><div className="brand-block"><span className="eyebrow">RECREATIONAL MODE · PROTOTYPE v2.2</span><h1>{APP_COPY.productName}</h1><p>Air dive planning · Tabla I · Detalle del cálculo</p></div>
    <NoticeBox tone="critical" title="Herramienta de planificación y verificación" message="No reemplaza formación, tablas oficiales, ordenador de buceo, supervisión ni criterio profesional. El resultado debe revisarse manualmente." />
    <div className="content-card"><h2>Esta versión permite:</h2><ul className="clean-list"><li>✓ Gas: aire</li><li>✓ Métrico e imperial</li><li>✓ Profundidad con redondeo hacia arriba</li><li>✓ Tiempo exacto contra límite de Tabla I</li><li>✓ Resultado simple + Detalle del cálculo</li><li>✓ Base preparada para grupo de presión final</li><li>✓ Checklist de validación manual</li></ul></div>
    <div className="hero-actions"><button className="primary-button primary-button--large" type="button" onClick={onStart}>Nueva planificación recreativa</button><button className="secondary-button secondary-button--large" type="button" onClick={onDemo}>Ver ejemplo</button></div>
  </section>;
}
