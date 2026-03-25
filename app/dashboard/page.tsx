"use client";

import { useContext } from "react";

import HorizontalSeparator from "@/components/horizontalSeparator";
import NotificationsSection from "@/components/sections/notificationsSection";
import PlayGameSection from "@/components/sections/playGameSection";

import { UserDataContext } from "./providers";

export default function Dashboard() {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const { name, username } = userData ?? {};

  return (
    <div>
      <header>
        <h1>Bonjour {username} 👋</h1>
      </header>
      <main className="main-container">
        <NotificationsSection />
        <PlayGameSection />

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
