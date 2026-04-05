export default function IconButton({
  title,
  icon,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-neutral btn-sm -mt-2"
    >
      {icon} {title}
    </button>
  );
}
