"use client";
import NavBar from "@/components/nav/navBar";
import VerticalSeparator from "@/components/verticalSeparator";
import routes from "@/utils/routes";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <NavBar />
      <div className="overflow-scroll flex-1">
        <div className="w-full flex gap-3 items-center py-5 px-4 border-b border-border sticky top-0 bg-background">
          {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          <VerticalSeparator />
          <h3 className="font-bold">{routes[pathname] || "Page Inconnue"}</h3>
        </div>
        <main className="px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
