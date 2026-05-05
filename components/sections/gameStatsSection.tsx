import { getGameStats } from "@/lib/fastapi/games";
import { HitDistributionChart } from "@/app/dashboard/stats/charts";

export default async function GameStatsSection({
  game_id,
}: {
  game_id: number;
}) {
  const stats = await getGameStats(game_id);

  const { data, error } = stats;

  console.log("Game stats data:", JSON.stringify(data, null, 2));

  if (error || !data) {
    if (typeof error === "string") {
      return <div>Error: {error}</div>;
    }
    return <div>Error</div>;
  }

  const chartData = data.zone_stats.map((i: any) => ({
    zone: i.zone.toString(),
    hits: i.total_hits,
  }));

  if (chartData.length === 0) {
    return (
      <section className="default-section">
        <div className="flex flex-col w-full items-center py-6 text-foreground-soft">
          <p>Aucune fléchette lancée (aucune statistique disponible)</p>
        </div>
      </section>
    );
  }

  return (
    <section className="default-section">
      <div className="flex flex-col w-full h-full">
        <HitDistributionChart data={chartData} />
      </div>
    </section>
  );
}
