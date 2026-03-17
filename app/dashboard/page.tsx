import HorizontalSeparator from "@/components/horizontalSeparator";
import NotificationsSection from "@/components/sections/notificationsSection";
import { games } from "@/utils/games";
import { Play } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
      <h1>Bonjour Mathias 👋</h1>
      <main className="main-container">
        <NotificationsSection />
        <section id="games-section" className="default-section">
          <h2>Jouer</h2>
          <ul className="flex gap-4 list-none">
            {games.map((game, index) => (
              // <li key={index}>
              //   <Link
              //     className="badge"
              //     href={`/dashboard/new-game?game=${game.slug}`}
              //   >
              //     {game.name}
              //   </Link>
              // </li>
              <li key={index}>
                <Link
                  className="badge hover-anim-badge group"
                  href={`/dashboard/new-game?game=${game.slug}`}
                >
                  {game.name}
                  <Play size={16} className="" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="summary-section" className="default-section">
          <h2>Résumé de la semaine</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="card">
              <h4 className="title">Nombre de parties jouées</h4>
              <p>12</p>
            </div>
            <div className="card">
              <h4 className="title">Nombre de parties gagnées</h4>
              <p>12</p>
            </div>
            <div className="card">
              <h4 className="title">Nombre de fléchettes lancées</h4>
              <p>12</p>
            </div>
            <div className="card">
              <h4 className="title">Zone les plus souvent touchées</h4>
              <ul>
                <li>
                  <b>1.</b> 20
                </li>
                <li>
                  <b>2.</b> Bull
                </li>
                <li>
                  <b>3.</b> T20
                </li>
              </ul>
            </div>
            <div className="card col-span-2 md:col-span-2 lg:col-span-4">
              <h4 className="title">Dernières parties de la semaine</h4>
              <ul className="flex flex-col *:flex *:justify-between">
                <li>
                  <p>
                    <b>Victoire</b> à <b>Chez Cabu</b>
                  </p>
                  <p>12/10/25 à 20:00</p>
                </li>
                <HorizontalSeparator bg="bg-background" />
                <li>
                  <p>
                    <b>Victoire</b> à <b>Kickoff</b>
                  </p>
                  <p>10/10/25 à 22:15</p>
                </li>
                <HorizontalSeparator bg="bg-background" />
                <li>
                  <p>
                    <b>Défaite</b> à <b>Kickoff</b>
                  </p>
                  <p>10/10/25 à 22:00</p>
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="card mt-5 p-4">
            <ul className="flex flex-col">
              <li>Partie 1 : Victoire contre John - Score : 501-450</li>
              <li>Partie 2 : Défaite contre Jane - Score : 301-350</li>
              <li>Partie 3 : Victoire contre Bob - Score : 501-400</li>
            </ul>
          </div> */}
        </section>
      </main>
    </div>
  );
}
