import type { CalculationStepCategory } from "../../../domain/dive-planner-core/shared/trace";
import type { RecreationalAirDiveResult } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { useI18n } from "../../../i18n/I18nProvider";
import { localizedStep, localizedValidationStatus } from "../../../i18n/domainPresentation";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";

const CATEGORY_ORDER: CalculationStepCategory[] = [
  "input",
  "conversion",
  "validation",
  "rounding",
  "lookup",
  "pressureGroup",
  "surfaceInterval",
  "residualNitrogen",
  "repetitiveDive",
  "comparison",
  "result",
];

type Props = {
  result: RecreationalAirDiveResult;
  onBack: () => void;
  onValidate: () => void;
};


function splitDatasetVersion(datasetVersion: string): string[] {
  return datasetVersion
    .split(/\s+\+\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getDatasetLabel(dataset: string, locale: "pt-BR" | "es-AR"): string {
  const normalized = dataset.toLowerCase();
  if (normalized.includes("table_iii")) return locale === "pt-BR" ? "Tabela III" : "Tabla III";
  if (normalized.includes("table_ii")) return locale === "pt-BR" ? "Tabela II" : "Tabla II";
  if (normalized.includes("table_i")) return locale === "pt-BR" ? "Tabela I" : "Tabla I";
  return "Dataset";
}

function splitDetail(detail: string): string[] {
  return detail
    .replace(/\.\s+/g, ".|")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CalculationDetailScreen({ result, onBack, onValidate }: Props) {
  const { locale, copy } = useI18n();

  const categoryMeta = (category: CalculationStepCategory) => {
    const entry = copy.detail.categories[category as keyof typeof copy.detail.categories];
    if (!entry) return null;
    return { title: entry[0], description: entry[1] };
  };

  const sourceName = locale === "pt-BR" ? "CMAS/FEDECAS - Tabelas para Mergulho Recreativo" : result.sourceReference.name;
  const tableName = locale === "pt-BR"
    ? "Tabela I - Limites de tempo e letra de classificação ao final do mergulho"
    : result.sourceReference.table;
  const sourceVersion = locale === "pt-BR" ? result.sourceReference.version.replace("prototipo", "protótipo") : result.sourceReference.version;
  const sourceBasis = locale === "pt-BR"
    ? "Baseado em tabelas da U.S. Navy, conforme documento de referência compartilhado para validação do protótipo."
    : result.sourceReference.basis;
  const datasetEntries = splitDatasetVersion(result.datasetVersion);

  return (
    <section className="screen screen--calculation-detail">
      <StepHeader title={copy.detail.title} subtitle={copy.detail.subtitle} currentStep={3} totalSteps={4} onBack={onBack} />

      <NoticeBox tone="warning" title={copy.detail.traceTitle} message={copy.detail.traceMessage} />

      <div className="calculation-detail-stack">
        {CATEGORY_ORDER.map((category, categoryIndex) => {
          const meta = categoryMeta(category);
          if (!meta) return null;

          const steps = result.calculationSteps.filter((step) => step.category === category);
          if (steps.length === 0) return null;

          return (
            <section className="content-card calculation-section" key={category}>
              <header className="calculation-section__header">
                <span className="calculation-section__eyebrow">{copy.common.step} {categoryIndex + 1}</span>
                <h2>{meta.title}</h2>
                <p>{meta.description}</p>
              </header>

              <div className="calculation-step-list calculation-step-list--spacious">
                {steps.map((step, index) => {
                  const localized = localizedStep(step, locale);
                  const detailLines = splitDetail(localized.detail);
                  const showTitle = localized.title.trim().toLocaleLowerCase(locale) !== meta.title.trim().toLocaleLowerCase(locale);

                  return (
                    <article
                      className={`calculation-step calculation-step--detail${steps.length > 1 ? " calculation-step--with-index" : ""}${showTitle ? "" : " calculation-step--no-title"}`}
                      key={step.id}
                    >
                      {steps.length > 1 ? <span className="calculation-step__index">{index + 1}</span> : null}
                      <div className="calculation-step__body">
                        {showTitle ? <strong>{localized.title}</strong> : null}
                        <ul className="calculation-step__lines">
                          {detailLines.map((line, lineIndex) => <li key={`${step.id}-${lineIndex}`}>{line}</li>)}
                        </ul>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="content-card calculation-source-card">
        <header className="calculation-section__header">
          <span className="calculation-section__eyebrow">{copy.detail.traceTitle}</span>
          <h2>{copy.detail.technicalSource}</h2>
          <p>{copy.detail.technicalSourceDescription}</p>
        </header>

        <div className="calculation-source-grid">
          <div><span>{copy.common.source}</span><strong>{sourceName}</strong></div>
          <div><span>{copy.detail.tableUsed}</span><strong>{tableName}</strong></div>
          <div><span>{copy.detail.versionBasis}</span><strong>{sourceVersion}</strong><small>{sourceBasis}</small></div>
          <div className="calculation-source-grid__full calculation-source-datasets">
            <span>{copy.common.dataset}</span>
            <div className="dataset-version-list">
              {datasetEntries.map((dataset) => (
                <div className="dataset-version-item" key={dataset}>
                  <small>{getDatasetLabel(dataset, locale)}</small>
                  <strong>{dataset}</strong>
                </div>
              ))}
            </div>
          </div>
          <div><span>{copy.common.engine}</span><strong>{result.engineVersion}</strong></div>
          <div><span>{copy.common.validation}</span><strong>{localizedValidationStatus(result.sourceReference.validationStatus, locale)}</strong></div>
        </div>
      </section>

      <PrimaryActionBar secondaryLabel={copy.common.result} primaryLabel={copy.common.manualValidation} onSecondary={onBack} onPrimary={onValidate} />
    </section>
  );
}
