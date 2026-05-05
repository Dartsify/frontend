import { Suspense } from "react";

import { GameDetail } from "@/utils/types";

import FinishedGame from "./finishedGame";
import GameStatsSection from "../sections/gameStatsSection";
import Spinner from "../spinner";

export default async function FinishedGameWrapper(game: GameDetail) {
  return (
    <div className="flex flex-col gap-3">
      <Suspense fallback={<Spinner />}>
        <GameStatsSection game_id={game.id} />
      </Suspense>
      <FinishedGame game={game} /> {/* Client Component */}
    </div>
  );
}
