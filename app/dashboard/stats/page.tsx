import {
  getMyStats,
  getMyZonesStats,
  getMyHeatmap,
} from "@/lib/fastapi/players";
import Dartboard from "@/components/dartboard";
import { HeatmapData, Stats, ZonesStats } from "@/utils/types";
import {
  HitDistributionChart,
  WinRateChart,
  HitMissChart,
  Podium,
} from "./charts";

export default async function StatsPage() {
  const [statsRes, zonesStatsRes, heatmapRes] = await Promise.all([
    getMyStats(),
    getMyZonesStats(),
    getMyHeatmap(),
  ]);

  if (statsRes.error || zonesStatsRes.error || heatmapRes.error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h1 className="text-2xl font-bold text-red-500">
          Erreur lors de la récupération des statistiques
        </h1>
        {statsRes.error && <p className="text-gray-500">{statsRes.error}</p>}
        {zonesStatsRes.error && (
          <p className="text-gray-500">{zonesStatsRes.error}</p>
        )}
        {heatmapRes.error && (
          <p className="text-gray-500">{heatmapRes.error}</p>
        )}
      </div>
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

  const maxZoneCount =
    sortedZonesStats.length > 0 ? sortedZonesStats[0].hits : 1;

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
          <StatCard title="Cible maudite" value={cursed_target || "Aucune"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {favorite_targets && favorite_targets.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Podium des cibles favorites
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Les zones que tu vises avec le plus de succès.
              </p>
              <div className="flex-1 flex items-center justify-center">
                <Podium targets={favorite_targets} />
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Ratios Globaux
            </h2>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-2 text-center">
                  Victoires vs Défaites
                </h3>
                <WinRateChart wins={total_wins} games={total_games_played} />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-gray-500 mb-2 text-center">
                  Précision Globale
                </h3>
                <HitMissChart
                  thrown={total_darts_thrown}
                  misses={total_misses}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-900 mb-6 self-start">
              Heatmap de la cible
            </h2>
            <div className="flex-1 w-full flex items-center justify-center">
              {heatmapData && heatmapData.length > 0 ? (
                <Dartboard size={320} points={heatmapData} />
              ) : (
                <p className="text-gray-500 italic">
                  Pas assez de données pour la heatmap
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Zones les plus touchées
            </h2>
            <div className="flex-1 min-h-[300px] w-full mt-4">
              {sortedZonesStats.length > 0 ? (
                <HitDistributionChart data={sortedZonesStats} />
              ) : (
                <p className="text-gray-500 italic flex items-center justify-center h-full">
                  Aucune donnée de zone disponible
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
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
      <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase">
        {title}
      </h3>
      <p className="text-xl font-black text-gray-900">
        {value !== undefined ? value : "0"}
      </p>
    </div>
  );
}
