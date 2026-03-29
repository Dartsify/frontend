"use client";

import Link from "next/link";
import { useContext } from "react";

import { Game } from "@/utils/types";
import { utcConvert } from "@/utils/dates";

import { UserDataContext } from "@/app/dashboard/providers";

const tableFields = ["Lieu", "Cible", "Mode", "Gagnant", "Joueurs", "Date"];

const listItem = async (
  game: Game,
  index: number,
  username: string | undefined,
) => {
  const {
    id,
    status,
    target_id,
    mode,
    start_date,
    target_name,
    target_location,
    winner_username,
    player_count,
  } = game;

  const isMe = winner_username === username;

  return (
    <li key={index}>
      <Link
        className={`table-line ${index % 2 === 0 ? "bg-background" : "bg-background-dark"}`}
        href={`/dashboard/my-games/${id}`}
      >
        <p>{target_name || "Inconnue"}</p>
        <p>{target_location || "Inconnu"}</p>
        <p>{mode}</p>
        <p>
          {winner_username && username
            ? isMe
              ? "Moi"
              : winner_username
            : "Inconnu"}
        </p>
        <p>{player_count || "N/A"}</p>
        <p>{utcConvert(start_date).format("DD/MM/YYYY HH:mm")}</p>
      </Link>
    </li>
  );
};

export default function FinishedGamesSection({ games }: { games: Game[] }) {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const { username } = userData ?? {};

  return (
    <section id="my-games-section" className="default-section">
      <h2>Parties terminées</h2>
      {games.length === 0 ? (
        <p>Aucune partie</p>
      ) : (
        <>
          {/* Specify the number of columns in the table -> here we want 6 columns with diff sizes (according to the field content) */}
          {/* By default, I specified 6 columns with fix size */}
          <ul className="table [&_.table-line]:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.4fr)]">
            {/* First elem is the header (with the fields) */}
            <li key={-1} className="table-header table-line">
              {tableFields.map((field, index) => (
                <p key={index}>{field}</p>
              ))}
            </li>
            {games.map((game, index) => listItem(game, index, username))}
          </ul>
        </>
      )}
    </section>
  );
}
