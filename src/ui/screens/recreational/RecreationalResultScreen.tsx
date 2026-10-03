import type { RecreationalAirDiveResult } from "../../../domain/dive-planner-core/recreational/air/recreationalAirTypes";
import { useI18n } from "../../../i18n/I18nProvider";
import { localizedRepetitiveMessage, localizedResultLabel, localizedWarning } from "../../../i18n/domainPresentation";
import { NoticeBox } from "../../components/NoticeBox";
import { PrimaryActionBar } from "../../components/PrimaryActionBar";
import { StepHeader } from "../../components/StepHeader";
import { SummaryCard } from "../../components/SummaryCard";

type Props = {
  result: RecreationalAirDiveResult;
  onBack: () => void;
  onDetail: () => void;
  onValidate: () => void;
  onNewPlan: () => void;
};

function getTone(status: RecreationalAirDiveResult["status"]): "success" | "warning" | "critical" {
  return status === "within_table_limit" ? "success" : status === "requires_manual_review" ? "warning" : "critical";
}

function formatInterval(minutes: number | null, notApplicable: string): string {
  if (minutes === null) return notApplicable;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours} h ${mins.toString().padStart(2, "0")} min` : `${mins} min`;
}

export function RecreationalResultScreen({ result, onBack, onDetail, onValidate, onNewPlan }: Props) {
  const { locale, copy } = useI18n();
  const inputDepthUnit = result.input.unitSystem === "metric" ? "m" : "ft";
  const residual = result.repetitiveDiveAnalysis.residualNitrogen;
  const surface = result.repetitiveDiveAnalysis.surfaceInterval;
  const isRepetitive = result.repetitiveDiveAnalysis.requested;
  const notApplicable = copy.common.notApplicable;
  const formatValue = (value: number | null, suffix: string) => value === null ? notApplicable : `${value} ${suffix}`;

  const pressureGroupValue = result.finalPressureGroup.status === "available" && result.finalPressureGroup.group
    ? result.finalPressureGroup.group
    : result.finalPressureGroup.status === "pending_dataset"
      ? copy.common.pending
      : notApplicable;

  const pressureGroupDetail = result.finalPressureGroup.status === "available"
    ? copy.result.assignedByTableI
    : result.finalPressureGroup.status === "pending_dataset"
      ? copy.result.structureReady
      : copy.result.noGroupCalculation;

  const repetitiveStatusLabel = (() => {
    switch (result.repetitiveDiveAnalysis.status) {
      case "not_requested":
      case "ready_for_repetitive_input": return result.repetitiveDiveAnalysis.requested ? copy.common.pending : copy.result.noRequested;
      case "calculated_within_adjusted_limit": return copy.result.withinAdjustedLimit;
      case "exceeds_adjusted_no_decompression_limit": return copy.result.exceedsAdjustedLimit;
      case "surface_interval_out_of_range": return copy.result.surfaceOutOfTable;
      case "unsupported_second_dive_depth": return copy.result.unsupportedSecondDepth;
      case "residual_table_entry_not_supported": return copy.result.unsupportedCell;
      case "blocked_by_first_dive": return copy.result.blockedByFirstDive;
      case "invalid_repetitive_input": return copy.result.invalidRepetitiveData;
      default: return copy.result.requiresReview;
    }
  })();

  return (
    <section className="screen">
      <StepHeader title={copy.result.title} subtitle={copy.result.subtitle} currentStep={2} totalSteps={4} onBack={onBack} />

      <NoticeBox tone={getTone(result.status)} title={localizedResultLabel(result, locale)} message={copy.result.reviewMessage} />

      <div className="summary-grid">
        <SummaryCard title={copy.result.planType} value={isRepetitive ? copy.result.repetitive : copy.result.simple} />
        <SummaryCard title={copy.result.depth1} value={`${result.input.depth} ${inputDepthUnit}`} />
        <SummaryCard title={copy.result.bottomTime1} value={`${result.input.bottomTime} min`} />
        <SummaryCard title="Gas" value={copy.common.air} />
        <SummaryCard
          title={copy.result.effectiveDepth1}
          value={result.effectiveDepth ? `${result.effectiveDepth.meters} m / ${result.effectiveDepth.feet} ft` : notApplicable}
          detail={result.rounding.depthRounded ? copy.result.roundedUp : copy.result.noDepthRounding}
        />
        <SummaryCard title={copy.result.tableILimit} value={formatValue(result.limit, "min")} />
        <SummaryCard
          title={copy.result.remainingTime1}
          value={formatValue(result.remainingTime, "min")}
          detail={result.remainingTime !== null && result.remainingTime < 0 ? copy.result.exceedsLimit : undefined}
        />
        <SummaryCard title={copy.result.finalPressureGroup} value={pressureGroupValue} detail={pressureGroupDetail} />
      </div>

      {isRepetitive && (
        <div className="content-card repetitive-result-card">
          <h2>{copy.result.repetitiveDive}</h2>
          <div className="summary-grid">
            <SummaryCard title={copy.result.surfaceInterval} value={formatInterval(surface.inputSurfaceIntervalMinutes, notApplicable)} detail={copy.result.timeOutOfWater} />
            <SummaryCard title={copy.result.newGroup} value={surface.resultingPressureGroup ?? notApplicable} detail={copy.result.calculatedByTableII} />
            <SummaryCard
              title={copy.result.effectiveDepth2}
              value={residual.secondDiveEffectiveDepth ? `${residual.secondDiveEffectiveDepth.meters} m / ${residual.secondDiveEffectiveDepth.feet} ft` : notApplicable}
              detail={residual.secondDiveDepthRounded ? copy.result.roundedUp : copy.result.accordingInputDepth}
            />
            <SummaryCard title={copy.result.bottomTime2} value={formatValue(residual.secondDiveInputBottomTime, "min")} />
            <SummaryCard title={copy.result.residualNitrogen} value={formatValue(residual.residualNitrogenMinutes, "min")} detail={copy.result.residualDetail} />
            <SummaryCard title={copy.result.adjustedLimit} value={formatValue(residual.adjustedNoDecompressionLimitMinutes, "min")} />
            <SummaryCard title={copy.result.totalEquivalentTime} value={formatValue(residual.totalEquivalentBottomTimeMinutes, "min")} />
            <SummaryCard title={copy.result.repetitiveStatus} value={repetitiveStatusLabel} detail={localizedRepetitiveMessage(result, locale)} />
          </div>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="content-card">
          <h2>{copy.common.warnings}</h2>
          <ul className="clean-list">
            {result.warnings.map((warning, index) => <li key={`${warning.level}-${index}`}>• {localizedWarning(warning, result, locale)}</li>)}
          </ul>
        </div>
      )}

      <div className="dual-actions">
        <button className="secondary-button" type="button" onClick={onDetail}>{copy.result.detailButton}</button>
        <button className="secondary-button" type="button" onClick={onValidate}>{copy.common.manualValidation}</button>
      </div>

      <PrimaryActionBar secondaryLabel={copy.common.editData} primaryLabel={copy.common.newPlan} onSecondary={onBack} onPrimary={onNewPlan} />
    </section>
  );
}
