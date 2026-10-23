export default function HorizontalSeparator({
  bg = "bg-border",
  my = "my-2.5",
}: {
  bg?: string;
  my?: string;
}) {
  return <div className={`${bg} h-px self-stretch ${my} rounded-full`} />;
}
