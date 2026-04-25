export default function InlineIconButton({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="btn btn-inline">
      {icon} {title}
    </button>
  );
}
