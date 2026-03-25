import moment from "moment";
import Link from "next/link";

import { Game } from "@/utils/types";

export default function CurrentGamesSection({ games }: { games: Game[] }) {
  const listItem = (game: Game, index: number) => {
    const { id, status, target_id, start_date } = game;
    return (
      <li key={index}>
        <Link href={`/dashboard/my-games/${id}`} className="badge">
          id : {id} - status : {status} - target : {target_id} - date :{" "}
          {moment(start_date).format("DD/MM/YYYY HH:mm")}
        </Link>
      </li>
    );
  };

  return (
    <section id="my-games-section" className="default-section">
      <h2>Parties en cours</h2>
      {games.length === 0 && <p>Aucune partie</p>}
      <ul className="flex gap-4 list-none">
        {games.map((game, index) => listItem(game, index))}
      </ul>
    </section>
  );
}
