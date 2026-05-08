import { Suspense } from "react";

import { GameDetail } from "@/utils/types";

import FinishedGame from "./finishedGame";
import GameStatsSection from "../sections/gameStatsSections";
import Spinner from "../spinner";

// Wrapper for the finished game page -> bc we show the finishedGame client default component + the gameStatsSection which is async and needs to be wrapped in suspense (to show a spinner while loading)
export default async function FinishedGameWrapper(game: GameDetail) {
  return (
    <div className="flex flex-col gap-3">
      {/* Client Component */}
      <FinishedGame game={game} />

      {/* Game Stats Section */}
      <Suspense fallback={<Spinner />}>
        <GameStatsSection game={game} />
      </Suspense>
    </div>
  );
}
