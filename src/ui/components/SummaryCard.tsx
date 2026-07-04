type SummaryCardProps = {
  title: string;
  value: string;
  detail?: string;
};

export function SummaryCard({ title, value, detail }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <span>{title}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}
