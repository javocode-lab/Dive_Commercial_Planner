import { useMemo, useState } from "react";
import type { RecreationalAirDiveResult } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { useI18n } from "../../../i18n/I18nProvider";
import { localizedResultLabel } from "../../../i18n/domainPresentation";
import { ChecklistItem } from "../../components/ChecklistItem";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";

type ValidationKey =
  | "inputReviewed"
  | "conversionsReviewed"
  | "rulesReviewed"
  | "pressureGroupReviewed"
  | "surfaceIntervalReviewed"
  | "residualNitrogenReviewed"
  | "secondDiveReviewed"
  | "resultReviewed"
  | "warningsReviewed"
  | "notAuthorizationAccepted";

type Props = { result: RecreationalAirDiveResult; onBack: () => void; onNewPlan: () => void };

export function HumanValidationScreen({ result, onBack, onNewPlan }: Props) {
  const { locale, copy } = useI18n();
  const [checks, setChecks] = useState<Record<ValidationKey, boolean>>({
    inputReviewed: false,
    conversionsReviewed: false,
    rulesReviewed: false,
    resultReviewed: false,
    warningsReviewed: false,
    pressureGroupReviewed: false,
    surfaceIntervalReviewed: false,
    residualNitrogenReviewed: false,
    secondDiveReviewed: false,
    notAuthorizationAccepted: false
  });

  const isComplete = useMemo(() => Object.values(checks).every(Boolean), [checks]);
  const toggle = (key: ValidationKey) => setChecks((current) => ({ ...current, [key]: !current[key] }));
  const items = copy.validation.items;

  return (
    <section className="screen">
      <StepHeader title={copy.validation.title} subtitle={copy.validation.subtitle} currentStep={4} totalSteps={4} onBack={onBack} />
      <NoticeBox
        tone={isComplete ? "success" : "warning"}
        title={isComplete ? copy.validation.complete : copy.validation.pending}
        message={isComplete ? copy.validation.completeMessage : copy.validation.pendingMessage}
      />
      <div className="checklist-stack">
        {items.map((item) => {
          const key = item[0] as ValidationKey;
          const label = item[1];
          const description = item[2];
          return <ChecklistItem key={key} label={label} description={description} checked={checks[key]} onToggle={() => toggle(key)} />;
        })}
      </div>
      <section className="content-card content-card--compact">
        <span>{copy.validation.technicalStatus}</span>
        <strong>{localizedResultLabel(result, locale)}</strong>
        <small>{copy.common.dataset}: {result.datasetVersion}</small>
      </section>
      <PrimaryActionBar secondaryLabel={copy.common.calculationDetail} primaryLabel={copy.common.newPlan} onSecondary={onBack} onPrimary={onNewPlan} />
    </section>
  );
}
