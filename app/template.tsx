import NavBar from "@/components/nav/navBar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="overflow-scroll w-full">{children}</div>
    </div>
  );
}
