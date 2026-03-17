"use client";

import { Calendar, ChartLine, House, Swords, Users } from "lucide-react";
import LogoBanner from "../logoBanner";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar({ isOpen }: { isOpen: boolean }) {
  const pathname: string = usePathname();

  const routeItem = (href: string, label: string, icon: React.ReactNode) => (
    <li className={`$${pathname == href && "active-link"}`}>
      <Link
        href={href}
        className={`hover-anim flex p-2 items-center transition-all duration-300 ease-in-out ${
          isOpen ? "gap-2 justify-start" : "gap-0 justify-center"
        } ${pathname == href && "active-link"}`}
      >
        <span
          className={`transition-transform duration-300 ease-in-out ${
            isOpen ? "scale-100" : "scale-125"
          }`}
        >
          {icon}
        </span>
        <p
          className={`leading-none text-sm-2 font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-x-0 max-w-40 ml-0"
              : "opacity-0 -translate-x-2 max-w-0 ml-0"
          }`}
        >
          {label}
        </p>
      </Link>
    </li>
  );

  const iconSize = 16;
  const iconStrokeWidth = 2.5;

  // const isSegmentActive: boolean = segment == pathname;

  return (
    <div
      className={`gradient-bg flex flex-col py-2 h-screen border-r border-border text-foreground-light transition-all duration-300 ease-in-out ${
        isOpen ? "w-60 px-4" : "w-20 px-2"
      }`}
    >
      <LogoBanner isOpen={isOpen} />

      <div
        className={`flex flex-col mt-8 ${
          isOpen ? "gap-10" : "gap-5 items-center"
        }`}
      >
        <div>
          <ul
            role="list"
            className={`flex flex-col ${
              isOpen ? "mt-3 gap-2.5" : "mt-0 gap-5 items-center"
            }`}
          >
            {routeItem(
              "/dashboard",
              "Accueil",
              <House size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
          </ul>
        </div>
        <div>
          <p
            className={`text-foreground-light-soft text-sm font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-100 max-h-6 mb-0" : "opacity-0 max-h-0"
            }`}
          >
            Jouer
          </p>
          <ul
            role="list"
            className={`flex flex-col ${
              isOpen ? "mt-1.5 gap-2.5" : "mt-0 gap-5 items-center"
            }`}
          >
            {routeItem(
              "/dashboard/new-game",
              "Nouvelle Partie",
              <Swords size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
          </ul>
        </div>
        <div>
          <p
            className={`text-foreground-light-soft text-sm font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-100 max-h-6 mb-0" : "opacity-0 max-h-0"
            }`}
          >
            Analyse
          </p>
          <ul
            role="list"
            className={`flex flex-col ${
              isOpen ? "mt-1.5 gap-2.5" : "mt-0 gap-5 items-center"
            }`}
          >
            {routeItem(
              "/dashboard/stats",
              "Statistiques",
              <ChartLine size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
            {routeItem(
              "/dashboard/my-games",
              "Mes Parties",
              <Calendar size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
          </ul>
        </div>
        <div>
          <p
            className={`text-foreground-light-soft text-sm font-semibold overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-100 max-h-6 mb-0" : "opacity-0 max-h-0"
            }`}
          >
            Social
          </p>
          <ul
            role="list"
            className={`flex flex-col ${
              isOpen ? "mt-1.5 gap-2.5" : "mt-0 gap-5 items-center"
            }`}
          >
            {routeItem(
              "/dashboard/groups-players",
              "Groupes de Joueurs",
              <Users size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
          </ul>
        </div>
      </div>
      <div className="flex-1" />
      <Link
        href={"/dashboard/account"}
        className={`flex items-center hover-anim p-2 transition-all duration-300 ease-in-out ${
          isOpen ? "gap-2 justify-start" : "gap-0 justify-center"
        }`}
      >
        <div className="relative size-8.5 shrink-0 overflow-hidden rounded-md border border-border">
          <Image
            src={`https://avatars.githubusercontent.com/${"mbartolas7"}`}
            alt="Avatar"
            fill
            sizes="100px"
            className="object-cover"
          />
        </div>
        <div
          className={`*:leading-none overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-x-0 max-w-40"
              : "opacity-0 -translate-x-2 max-w-0"
          }`}
        >
          <p>Mathias Bartolas</p>
          <p className="text-xs opacity-75 mt-0.5">@mbartolas7</p>
        </div>
      </Link>
    </div>
  );
}
