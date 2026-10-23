import {
  getMyStats,
  getMyZonesStats,
  getMyHeatmap,
} from "@/lib/fastapi/players";

import { mapBackendToDartboard } from "@/utils/games";
import Dartboard from "@/components/dartboard";

import { HeatmapData, Stats, ZonesStats } from "@/utils/types";

import {
  HitDistributionChart,
  WinRateChart,
  HitMissChart,
  Podium,
} from "../../../components/charts/charts";
import ErrorPageText from "@/components/errorPageText";

export default async function StatsPage() {
  const [statsRes, zonesStatsRes, heatmapRes] = await Promise.all([
    getMyStats(),
    getMyZonesStats(),
    getMyHeatmap(),
  ]);

  if (statsRes.error || zonesStatsRes.error || heatmapRes.error) {
    return ErrorPageText(
      statsRes.error || zonesStatsRes.error || heatmapRes.error,
    );
  }

  const stats = statsRes.data as Stats;
  const zonesStats = zonesStatsRes.data as ZonesStats;
  const heatmapData = heatmapRes.data as HeatmapData;

  const {
    total_games_played,
    total_wins,
    win_rate_percentage,
    average_points_per_dart,
    total_darts_thrown,
    total_misses,
    total_triple_20,
    total_180s,
    total_100_plus,
    cursed_target,
    favorite_targets,
  } = stats;

  const hitDistribution = zonesStats?.hit_distribution || [];

  const sortedZonesStats = [...hitDistribution]
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 15);

  return (
    <div>
      <h1>Mes Statistiques</h1>

      <main className="main-container flex flex-col gap-2 md:gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
          <StatCard title="Parties jouées" value={total_games_played} />
          <StatCard title="Victoires" value={total_wins} />
          <StatCard
            title="Taux de victoire"
            value={`${win_rate_percentage?.toFixed(1) || 0}%`}
          />
          <StatCard
            title="Moyenne / fléchette"
            value={average_points_per_dart?.toFixed(2) || 0}
          />
          <StatCard title="Fléchettes lancées" value={total_darts_thrown} />
          <StatCard title="Ratés" value={total_misses} />
          <StatCard title="Total T20" value={total_triple_20} />
          <StatCard title="Total 180s" value={total_180s} />
          <StatCard title="Scores 100+" value={total_100_plus} />
          <StatCard title="Zone maudite" value={cursed_target || "Aucune"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {favorite_targets && favorite_targets.length > 0 && (
            <div className="card">
              <h3>Podium des zones favorites</h3>
              <p className="subtitle">
                Les zones que vous visez avec le plus de succès.
              </p>
              <div className="content mt-2 flex-1 flex items-center justify-center">
                <Podium targets={favorite_targets} />
              </div>
            </div>
          )}

          <div className="card">
            <h3>Ratios Globaux</h3>
            <p className="subtitle">Comparez vos performances.</p>
            <div className="content mt-2 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 flex-1">
              <div className="flex flex-col items-center">
                <WinRateChart wins={total_wins} games={total_games_played} />
              </div>
              <div className="flex flex-col items-center -mt-5 md:mt-0">
                <HitMissChart
                  thrown={total_darts_thrown}
                  misses={total_misses}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
          <div className="card">
            <h3>Heatmap de la cible</h3>
            <p className="subtitle">Visualisez où vous touchez la cible.</p>
            {/* <div className="content flex-1 w-full flex items-center justify-center">
              {heatmapData && heatmapData.length > 0 ? (
                <Dartboard
                  size={320}
                  points={heatmapData.map((p) =>
                    mapBackendToDartboard(p.x, p.y),
                  )}
                />
              ) : (
                <p className="text-gray-500 italic">
                  Pas assez de données pour la heatmap
                </p>
              )}
            </div> */}
            <div className="content">
              <p className="text-gray-500 italic flex items-center justify-center">
                Bientôt
              </p>
            </div>
          </div>

          <div className="card">
            <h3>Zones les plus touchées</h3>
            <p className="subtitle">
              Visualisez toutes vos zones les plus touchées.
            </p>
            <div className="content flex-1 min-h-75 w-full">
              {sortedZonesStats.length > 0 ? (
                <HitDistributionChart data={sortedZonesStats} />
              ) : (
                <p className="text-foreground-soft flex items-center justify-center h-full">
                  <i>Aucune donnée de zone disponible</i>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number | undefined;
}) {
  return (
    <div className="card card-xs">
      <h4>{title}</h4>
      <p>{value !== undefined ? value : "0"}</p>
    </div>
  );
}
