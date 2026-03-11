import { Calendar, ChartLine, Play, Users } from "lucide-react";
import LogoBanner from "../logoBanner";
import Link from "next/link";

export default function NavBar() {
  const routeItem = (href: string, label: string, icon: React.ReactNode) => (
    <li>
      <Link href={href} className="flex gap-2 items-center">
        {icon}
        <p className="leading-none text-sm-2">{label}</p>
      </Link>
    </li>
  );

  const iconSize = 16;
  const iconStrokeWidth = 2.5;

  return (
    <div className="flex flex-col px-4 py-2 h-screen border-r border-border">
      <LogoBanner />

      <div className="flex flex-col gap-10 mt-8">
        <div>
          <p className="text-text-secondary text-sm font-semibold leading-none">
            Jouer
          </p>
          <ul role="list" className="mt-5 flex flex-col gap-4.5">
            {routeItem(
              "/new-game",
              "Nouvelle Partie",
              <Play size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
          </ul>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-semibold leading-none">
            Analyse
          </p>
          <ul role="list" className="mt-5 flex flex-col gap-4.5">
            {routeItem(
              "/stats",
              "Statistiques",
              <ChartLine size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
            {routeItem(
              "/my-games",
              "Mes Parties",
              <Calendar size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
          </ul>
        </div>
        <div>
          <p className="text-text-secondary text-sm font-semibold leading-none">
            Social
          </p>
          <ul role="list" className="mt-5 flex flex-col gap-4.5">
            {routeItem(
              "/groups-players",
              "Groupes de Joueurs",
              <Users size={iconSize} strokeWidth={iconStrokeWidth} />,
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
