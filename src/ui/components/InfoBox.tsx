type InfoBoxTone = "info" | "warning" | "critical";

interface InfoBoxProps {
  title?: string;
  message: string;
  tone?: InfoBoxTone;
}

export function InfoBox({ title, message, tone = "info" }: InfoBoxProps) {
  return (
    <div className={`info-box info-box--${tone}`}>
      {title ? <strong>{title}</strong> : null}
      <p>{message}</p>
    </div>
  );
}
