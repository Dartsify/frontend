import { GamesPlayedDistributionChart } from "@/components/charts/charts";
import { FriendStatsSummary } from "@/utils/types";

export default function FriendsStatsSection({
  statsSummary,
}: {
  statsSummary: FriendStatsSummary[];
}) {
  const chartData = statsSummary
    .map((i: FriendStatsSummary) => ({
      name: i.player_name.replace("Me", "Moi"), // We replace "Me" by "Moi" for better readability in the chart
      games: i.stats.total_games_played,
      wins: i.stats.total_wins,
    }))
    .sort((a, b) => b.games - a.games); // We sort the players by number of games played to have a more relevant chart (the most active players will be first)

  // Reduce is better than sorting bc it finds the max in ONE PASS while sort needs to sort the whole array
  const mostActiveFriend = statsSummary.reduce((prev, current) => {
    return prev.stats.total_games_played > current.stats.total_games_played
      ? prev
      : current;
  }, statsSummary[0]);

  const bestFriend = statsSummary.reduce((prev, current) => {
    const prevWinRate = prev.stats.total_wins / prev.stats.total_games_played;
    const currentWinRate =
      current.stats.total_wins / current.stats.total_games_played;
    return prevWinRate > currentWinRate ? prev : current;
  }, statsSummary[0]);

  return (
    <section className="default-section">
      <h2>Statistiques du mois</h2>
      {/* Small cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3">
        <div className="card card-xs">
          <h4>Total amis</h4>
          <p>{statsSummary.length}</p>
        </div>

        <div className="card card-xs">
          <h4>Le plus actif</h4>
          <p>
            {mostActiveFriend.player_name.replace("Me", "Moi")}{" "}
            {mostActiveFriend.player_name !== "Me" &&
              `(@${mostActiveFriend.username})`}
          </p>
        </div>

        <div className="card card-xs">
          <h4>Le meilleur</h4>
          <p>
            {bestFriend.player_name.replace("Me", "Moi")}{" "}
            {bestFriend.player_name !== "Me" && `(@${bestFriend.username})`}
          </p>
        </div>
      </div>

      {/* Games played distribution chart */}
      <div className="card">
        <h3>Distribution des parties jouées et gagnées</h3>
        <div className="content">
          <GamesPlayedDistributionChart data={chartData} />
        </div>
      </div>
    </section>
  );
}
