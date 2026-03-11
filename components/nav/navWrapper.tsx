"use client";

import NavBar from "@/components/nav/navBar";
import VerticalSeparator from "@/components/verticalSeparator";
import { routeNames, routesWithColoredHeader } from "@/utils/routes";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import React, { useEffect, useState } from "react";
import Footer from "./footer";

export default function NavWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
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

  const isRouteWithColoredHeader = routesWithColoredHeader.includes(pathname);

  return (
    <div className="flex h-screen">
      <NavBar isOpen={open} />
      <div className="overflow-scroll flex-1 min-h-screen flex flex-col">
        <div
          className={`w-full flex gap-3 items-center py-5 px-4 border-border top-0 z-10 ${isRouteWithColoredHeader ? "fixed text-foreground-light" : "sticky bg-background text-foreground"}`}
        >
          <button
            type="button"
            onClick={handleToggleOpenSidebar}
            className="cursor-pointer"
          >
            {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          <VerticalSeparator />
          <h3 className="text-text-secondary text-sm-2 flex items-center">
            {segments.map((segment, index) => (
              <React.Fragment key={segment}>
                {/* {index > 0 && <span className="mx-3"> {">"} </span>} */}
                {index > 0 && <ChevronRight size={16} className="mx-3" />}
                {index === segments.length - 1 ? (
                  <span
                    className={`font-semibold ${isRouteWithColoredHeader ? "text-foreground-light" : "text-foreground"}`}
                  >
                    {routeNames[segment] || "Page Inconnue"}
                  </span>
                ) : (
                  <Link href={`/${segment}`} className="cursor-pointer">
                    {routeNames[segment] || "Page Inconnue"}
                  </Link>
                )}
              </React.Fragment>
            ))}
            {segments.length === 0 && (
              <span
                className={`font-semibold ${isRouteWithColoredHeader ? "text-foreground-light" : "text-foreground"}`}
              >
                {/* Affiche "Accueil" si aucun segment */}
                {routeNames[""]}
              </span>
            )}
          </h3>
        </div>
        <div className={`flex flex-col flex-1`}>
          <div className={`flex-1 ${isRouteWithColoredHeader ? "" : ""}`}>
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
