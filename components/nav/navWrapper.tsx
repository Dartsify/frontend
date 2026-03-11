"use client";

import NavBar from "@/components/nav/navBar";
import VerticalSeparator from "@/components/verticalSeparator";
import routes from "@/utils/routes";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const storedOpen = localStorage.getItem("sidebarOpen");
    if (storedOpen !== null) {
      setOpen(JSON.parse(storedOpen));
    }
  }, []);

  const handleToggleOpenSidebar = () => {
    localStorage.setItem("sidebarOpen", JSON.stringify(!open));

    setOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      <NavBar isOpen={open} />
      <div className="overflow-scroll flex-1">
        <div className="w-full flex gap-3 items-center py-5 px-4 border-b border-border sticky top-0 bg-background">
          <button type="button" onClick={handleToggleOpenSidebar}>
            {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          <VerticalSeparator />
          <h3 className="font-bold">{routes[pathname] || "Page Inconnue"}</h3>
        </div>
        <main className="px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
