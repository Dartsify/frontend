import { TimerIcon } from "lucide-react";

import HorizontalSeparator from "@/components/horizontalSeparator";
import NotificationsSection from "@/components/sections/notificationsSection";
import PlayGameSection from "@/components/sections/playGameSection";
import HomeHeader from "@/components/homeHeader";
import Timer from "@/components/timer";

import {
  getMyFriendsRequests,
  getMyStats,
  getPendingInvitations,
} from "@/lib/fastapi/players";
import { getGames } from "@/lib/fastapi/games";

import { DashboardNotification, Game } from "@/utils/types";
import { calendarConvert, utcConvert } from "@/utils/dates";
import { statusBadge } from "@/utils/games";

export default async function Dashboard() {
  // API calls
  const myStats = await getMyStats();
  const lastGames = await getGames({ limit: 3 });
  const pendingGames = await getPendingInvitations();
  const friendsRequests = await getMyFriendsRequests();

  // Data and errors of each API call
  const { data: statsData, error: statsError } = myStats;
  const { data: lastGamesData, error: lastGamesError } = lastGames;
  const { data: pendingGamesData, error: pendingGamesError } = pendingGames;
  const { data: friendsRequestsData, error: friendsRequestsError } =
    friendsRequests;

  // Handle errors for each API call
  if (statsError || !statsData) {
    if (typeof statsError === "string") {
      return <div>Error: {statsError}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  if (lastGamesError || !lastGamesData) {
    if (typeof lastGamesError === "string") {
      return <div>Error: {lastGamesError}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  if (pendingGamesError || !pendingGamesData) {
    if (typeof pendingGamesError === "string") {
      return <div>Error: {pendingGamesError}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  if (friendsRequestsError || !friendsRequestsData) {
    if (typeof friendsRequestsError === "string") {
      return <div>Error: {friendsRequestsError}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  // Data of the notifications (given to the NotificationsSection component) with a type property to know the type of notification (pending game or friend request)
  const notificationsData: DashboardNotification[] = [
    ...pendingGamesData.map((g) => ({
      ...g,
      type: "pending-game" as const,
    })),
    ...friendsRequestsData.map((f) => ({
      ...f,
      type: "friend-request" as const,
    })),
  ];

  const {
    total_games_played,
    total_darts_thrown,
    total_wins,
    favorite_targets,
  } = statsData;

  // Last game item list
  const listItem = (game: Game, index: number) => {
    const { target_location, player_count, creation_date, status, start_date } =
      game;
    const { text: statusText, color: statusColor } = statusBadge(status);

    return (
      <li key={index} className="py-0">
        <div className="flex justify-between items-center py-0">
          <div className="">
            <p className="font-medium">
              Partie à {player_count} joueur{player_count !== 1 ? "s" : ""}
            </p>
            <p className="text-sm-2 font-medium text-foreground-soft leading-none">
              {calendarConvert(creation_date)} à {target_location}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="badge badge-neutral badge-xs">
              <div className={`badge-disc-xs ${statusColor}`} />
              <p>{statusText}</p>
            </div>
            {status === "in_progress" && (
              <div className="badge badge-brand badge-xs">
                <TimerIcon size={12} />
                <Timer time={utcConvert(start_date).valueOf()} />
              </div>
            )}
          </div>
        </div>

        {index !== lastGamesData.length - 1 && (
          <HorizontalSeparator bg="bg-background" />
        )}
      </li>
    );
  };

  return (
    <div>
      <HomeHeader /> {/* Client Component (bc we get user data from context) */}
      <main className="main-container">
        <NotificationsSection data={notificationsData} />
        <PlayGameSection />

        <section id="summary-section" className="default-section">
          <h2>Résumé de la semaine</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="card">
              <h4 className="title">Nombre de parties jouées</h4>
              <p>{total_games_played}</p>
            </div>
            <div className="card">
              <h4 className="title">Nombre de parties gagnées</h4>
              <p>{total_wins}</p>
            </div>
            <div className="card">
              <h4 className="title">Nombre de fléchettes lancées</h4>
              <p>{total_darts_thrown}</p>
            </div>
            <div className="card">
              <h4 className="title">Zone les plus souvent touchées</h4>
              {favorite_targets.length === 0 ? (
                <p>
                  <i>Aucune donnée disponible</i>
                </p>
              ) : (
                <ul>
                  {favorite_targets.map((t, index) => {
                    return (
                      <li key={index}>
                        <b>{index + 1}.</b> {t}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="card col-span-2 md:col-span-2 lg:col-span-4">
              <h4 className="title">Dernières parties de la semaine</h4>
              {lastGamesData.length === 0 ? (
                <p>
                  <i>Aucune partie à afficher.</i>
                </p>
              ) : (
                <ul className="flex flex-col">
                  {lastGamesData?.map((game, index) => listItem(game, index))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
