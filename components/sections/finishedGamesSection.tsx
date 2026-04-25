"use client";

import Link from "next/link";
import { useContext, useState } from "react";

import { Game } from "@/utils/types";
import { utcConvert } from "@/utils/dates";

import { UserDataContext } from "@/app/dashboard/providers";
import TablePagination from "@/components/tablePagination";

const tableFields = ["Lieu", "Cible", "Mode", "Gagnant", "Joueurs", "Date"];

// We removed async as this shouldn't be async in a use client array map
const listItem = (game: Game, index: number, username: string | undefined) => {
  const {
    id,
    status,
    target_id,
    mode,
    start_date,
    creation_date,
    target_name,
    target_location,
    winner_username,
    player_count,
  } = game;

  const isMe = winner_username === username;

  return (
    <li key={index}>
      <Link
        // className={`table-line ${index % 2 === 0 ? "bg-white" : "bg-background"}`}
        className="table-line"
        href={`/dashboard/my-games/${id}`}
      >
        <p className="font-medium">{target_name || "Inconnue"}</p>
        <p>{target_location || "Inconnu"}</p>
        <p>{mode}</p>
        <p className="truncate pr-2">
          {winner_username && username
            ? isMe
              ? "Moi"
              : "@" + winner_username
            : "Inconnu"}
        </p>
        <p>{player_count || "N/A"}</p>
        <p className="font-medium">
          {creation_date
            ? utcConvert(creation_date).format("DD/MM/YYYY HH:mm")
            : "Inconnue"}
        </p>
      </Link>
    </li>
  );
};

export default function FinishedGamesSection({ games }: { games: Game[] }) {
  const userDataContext = useContext(UserDataContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const { username } = userData ?? {};

  const totalPages = Math.ceil(games.length / itemsPerPage);
  const paginatedGames = games.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <section id="my-games-section" className="default-section">
      <h2>Parties terminées</h2>
      {games.length === 0 ? (
        <p>Aucune partie</p>
      ) : (
        <>
          {/* Specify the number of columns in the table -> here we want 6 columns with diff sizes (according to the field content) */}
          {/* By default, I specified 6 columns with fix size */}
          <div className="w-full overflow-x-auto py-1.5 -mx-4 px-4 sm:-mx-1 sm:px-1">
            <ul className="table min-w-175 [&_.table-line]:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,1.4fr)]">
              {/* First elem is the header (with the fields) */}
              <li
                key={-1}
                className="table-header table-line text-foreground-soft font-semibold"
              >
                {tableFields.map((field, index) => (
                  <p key={index}>{field}</p>
                ))}
              </li>
              {paginatedGames.map((game, index) =>
                listItem(game, index, username),
              )}
            </ul>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}
