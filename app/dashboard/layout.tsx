import NavWrapper from "@/components/nav/navWrapper";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavWrapper>
      <div className="content testtt">{children}</div>
    </NavWrapper>
  );
}
