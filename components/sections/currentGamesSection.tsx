import Link from "next/link";
import { TimerIcon } from "lucide-react";

import { calendarConvert, utcConvert } from "@/utils/dates";
import { Game } from "@/utils/types";
import { gameHostName, statusBadge } from "@/utils/games";

import { getGame } from "@/lib/fastapi/games";

import Timer from "../timer";

const listItem = async (game: Game, index: number) => {
  // const { id, status, target_id, start_date, participants } = game;
  const { id } = game;

  const { data, error } = await getGame(id);

  if (error || !data) {
    if (typeof error === "string") {
      return <div>Error: {error}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  const {
    status,
    target_id,
    participations,
    target_description,
    target_location,
    target_name,
    start_date,
    creation_date,
    mode,
  } = data;

  const { text: statusText, color: statusColor } = statusBadge(status);
  const { name: hostName, username: hostUsername } =
    gameHostName(participations);

  return (
    <li key={index}>
      <Link
        // We want to go to the new-game page with the id of the game as a query parameter
        // There we will show the lobby page of the game, with the possibility to start the game if the user is the host
        href={
          status === "waiting"
            ? `/dashboard/new-game?game=${id}`
            : `/dashboard/my-games/${id}`
        }
        className="card cursor-pointer hover-anim-size-soft"
      >
        <header className="flex items-center justify-between">
          <div>
            <h4 className="title mb-0">
              Partie{" "}
              {participations.length > 1
                ? "à " + participations.length + " joueurs"
                : "en solo"}
            </h4>
            <p className="text-foreground-soft text-sm-2 font-medium">
              {calendarConvert(creation_date)}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className={`badge badge-neutral`}>
              <div className={`badge-disc ${statusColor}`} />
              <p>{statusText}</p>
            </div>
            {status === "in_progress" && (
              <div className="badge badge-brand">
                <TimerIcon size={14} />
                <Timer time={utcConvert(start_date).valueOf()} />
              </div>
            )}
          </div>
        </header>

        <p className="leading-5.5 mt-3">
          <b>{target_name ?? "Cible inconnue"}</b> à
          <b> {target_location ?? "Emplacement inconnu"}</b>
          <br />
          <b>Mode : </b> {mode}
          <br />
          <b>Chef de partie : </b> {hostName} (@{hostUsername})
        </p>
      </Link>
    </li>
  );
};

export default async function CurrentGamesSection({
  games,
}: {
  games: Game[];
}) {
  return (
    <section id="my-games-section" className="default-section">
      <h2>Parties en cours</h2>
      {games.length === 0 && <p>Aucune partie</p>}
      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 list-none">
        {games.map((game, index) => listItem(game, index))}
      </ul>
    </section>
  );
}
