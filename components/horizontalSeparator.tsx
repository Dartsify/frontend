export default function HorizontalSeparator({
  bg = "bg-border",
}: {
  bg?: string;
}) {
  return <div className={`${bg} h-px self-stretch my-1 rounded-full`} />;
}
