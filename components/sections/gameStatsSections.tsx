import { getGameStats } from "@/lib/fastapi/games";

import HitDistributionChartSection from "./finishedGameStatsSections/hitDistributionChartSection";
import { GameDetail } from "@/utils/types";

// Game stats section for the finished game page
export default async function GameStatsSections({
  game,
}: {
  game: GameDetail;
}) {
  const stats = await getGameStats(game.id);

  const { data, error } = stats;

  // Handling the error case
  if (error || !data) {
    if (typeof error === "string") {
      return <div>Error: {error}</div>;
    }
    return <div>Error</div>;
  }

  if (data.zone_stats.length === 0) {
    return (
      <section className="default-section">
        <div className="flex flex-col w-full items-center py-6 text-foreground-soft">
          <p>Aucune fléchette lancée (aucune statistique disponible)</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <HitDistributionChartSection chartData={data} gameData={game} />
    </>
  );
}
