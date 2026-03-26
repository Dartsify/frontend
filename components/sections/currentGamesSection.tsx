import moment from "moment";
import Link from "next/link";
import { TimerIcon } from "lucide-react";

import { Game } from "@/utils/types";

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
    mode,
  } = data;

  // Return a good text (in French) and a color for status
  const statusBadge = () => {
    switch (status) {
      case "waiting":
        return { text: "Préparation", color: "bg-highlight" };
      case "in_progress":
        return { text: "En cours", color: "bg-green-500" };
      default:
        return { text: "Inconnue", color: "bg-gray-500" };
    }
  };

  // Return the name of the host of the game
  const gameHostName = () => {
    const host = participations.find((p) => p.is_host == true);

    return host
      ? { name: host.player_name, username: host.player_username }
      : { name: "Inconnu", username: "N/A" };
  };

  const { text: statusText, color: statusColor } = statusBadge();
  const { name: hostName, username: hostUsername } = gameHostName();

  return (
    <li key={index}>
      <Link
        href={`/dashboard/my-games/${id}`}
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
              {moment(start_date).calendar()}
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
                <Timer time={start_date} />
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
