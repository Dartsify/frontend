export default function Loading() {
  return (
    <div className="absolute inset-0 z-12 gradient-bg flex items-center justify-center text-foreground-light">
      <div className="loader-circle animate-spin-alt" />
    </div>
  );
}
