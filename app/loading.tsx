export default function Loading() {
  return (
    <div className="h-screen w-screen gradient-bg flex items-center justify-center text-foreground-light">
      <div className="loader-circle animate-spin-alt" />
    </div>
  );
}
