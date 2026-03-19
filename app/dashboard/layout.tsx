import { Suspense } from "react";
import DashboardContent from "./dashboardContent";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loading = () => (
    <div className="h-screen w-screen gradient-bg flex items-center justify-center text-foreground-light">
      <div className="loader-circle animate-spin-alt" />
    </div>
  );

  return (
    <Suspense fallback={loading()}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
