import { Play } from "lucide-react";
import Link from "next/link";

import { games } from "@/utils/games";

export default function PlayGameSection() {
  return (
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
              className="game-badge hover-anim-badge group"
              href={`/dashboard/new-game?game=${game.slug}`}
            >
              {game.name}
              <Play size={16} className="" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
