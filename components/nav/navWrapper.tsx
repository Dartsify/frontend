"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname, useSelectedLayoutSegments } from "next/navigation";

import NavBar from "@/components/nav/navBar";
import VerticalSeparator from "@/components/verticalSeparator";

import { routeNames, routesWithColoredHeader } from "@/utils/routes";

import Footer from "./footer";

export default function NavWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = useSelectedLayoutSegments();
  const [open, setOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedOpen = localStorage.getItem("sidebarOpen");
    if (storedOpen !== null) {
      setOpen(JSON.parse(storedOpen));
    }
  }, []);

  useEffect(() => {
    const handleWindowScroll = () => {
      // On mobile, the window or document scrolls. We check the scroll position here.
      if (window.innerWidth < 640) {
        setScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  const handleToggleOpenSidebar = () => {
    localStorage.setItem("sidebarOpen", JSON.stringify(!open));

    setOpen((prev) => !prev);
  };

  const isRouteWithColoredHeader: boolean =
    routesWithColoredHeader.includes(pathname);

  return (
    <div className="flex sm:h-screen sm:overflow-visible">
      {/* Navbar shown at right of the screen */}
      <NavBar isOpen={open} />

      {/* Content of the page */}
      <div
        className="w-screen overflow-x-visible sm:overflow-scroll flex-1 min-h-screen flex flex-col"
        onScroll={(e) => {
          // Sur desktop (>= 640px), c'est cette div qui scroll
          if (window.innerWidth >= 640) {
            setScrolled(e.currentTarget.scrollTop > 50);
          }
        }}
      >
        {/* Nav header shown at the top of the content */}
        <div
          className={`horizontal-p vertical-p w-full flex gap-3 items-center top-0 z-10 transition-colors duration-300 border-b-2 ${scrolled ? "border-border" : "border-transparent"} ${isRouteWithColoredHeader ? "fixed text-foreground-light" : "sticky bg-background text-foreground"}`}
          id="nav-header"
        >
          <button
            type="button"
            onClick={handleToggleOpenSidebar}
            className="cursor-pointer hidden sm:block"
          >
            {open ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
          <div className="hidden sm:flex sm:h-full">
            <VerticalSeparator />
          </div>
          <h3 className="text-foreground-dark text-sm-2 flex items-center">
            {segments.map((segment, index) => {
              return (
                <React.Fragment key={segment}>
                  {/* {index > 0 && <span className="mx-3"> {">"} </span>} */}
                  {index > 0 && <ChevronRight size={16} className="mx-3" />}
                  {index === segments.length - 1 ? (
                    // The last segment is not a link
                    <span
                      className={`font-semibold ${isRouteWithColoredHeader ? "text-foreground-light" : "text-foreground"}`}
                    >
                      {/* If the previous segment is "my-games", means we are in a details game page -> show a specific text */}
                      {segments[index - 1] === "my-games"
                        ? `Détails de la partie ${segment}`
                        : routeNames[segment] || "Page Inconnue"}
                    </span>
                  ) : (
                    // Show the previous segments as links to their respective pages
                    <Link
                      href={`/dashboard/${segment}`}
                      className="cursor-pointer"
                    >
                      {routeNames[segment] || "Page Inconnue"}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}

            {/* Shows "Accueil" if no segment */}
            {segments.length === 0 && (
              <span
                className={`font-semibold ${isRouteWithColoredHeader ? "text-foreground-light" : "text-foreground"}`}
              >
                {routeNames[""]}
              </span>
            )}
          </h3>
        </div>

        {/* Main content area */}
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
