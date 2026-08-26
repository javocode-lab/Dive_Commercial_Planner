type StepHeaderProps = {
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
};

export function StepHeader({
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack
}: StepHeaderProps) {
  const hasProgress = currentStep !== undefined && totalSteps !== undefined;

  return (
    <header className="step-header">
      <div className="step-header__topline">
        {onBack ? (
          <button className="ghost-button" type="button" onClick={onBack}>
            ← Atrás
          </button>
        ) : (
          <span />
        )}

        {hasProgress && (
          <span className="step-header__progress">
            {currentStep}/{totalSteps}
          </span>
        )}
      </div>

      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}
