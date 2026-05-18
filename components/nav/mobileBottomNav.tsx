"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BowArrow, Calendar, ChartLine, Handshake, House } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // We don't show the mobile bottom nav if we are not in the dashboard
  if (!pathname.startsWith("/dashboard")) {
    return null;
  }

  const navItems = [
    { href: "/dashboard", icon: House, label: "Accueil" },
    { href: "/dashboard/new-game", icon: BowArrow, label: "Jouer" }, // or "Nouvelle"
    { href: "/dashboard/stats", icon: ChartLine, label: "Stats" },
    { href: "/dashboard/my-games", icon: Calendar, label: "Parties" },
    { href: "/dashboard/friends", icon: Handshake, label: "Amis" },
  ];

  return (
    <div className="flex bg-brand fixed bottom-0 left-0 right-0 md:hidden pt-4 pb-[calc(12px+env(safe-area-inset-bottom))] px-4 justify-between items-center rounded-b-none rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-9">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-300 ${
              isActive
                ? "text-foreground-light scale-110"
                : "text-foreground-light-soft hover:text-foreground-light/80"
            }`}
          >
            <Icon size={isActive ? 26 : 24} strokeWidth={isActive ? 2.5 : 2} />
            <span
              className={`text-xs font-medium leading-none ${isActive ? "font-bold" : ""}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
