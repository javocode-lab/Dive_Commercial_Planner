type NoticeBoxProps = {
  title?: string;
  message: string;
  tone?: "info" | "warning" | "critical" | "success";
};

export function NoticeBox({ title, message, tone = "info" }: NoticeBoxProps) {
  return (
    <aside className={`notice-box notice-box--${tone}`}>
      {title && <strong>{title}</strong>}
      <p>{message}</p>
    </aside>
  );
}
