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
import ErrorPageText from "@/components/errorPageText";

export default async function Dashboard() {
  // API calls
  const [myStats, lastGames, pendingGames, friendsRequests] = await Promise.all(
    [
      getMyStats(),
      getGames({ limit: 3 }),
      getPendingInvitations(),
      getMyFriendsRequests(),
    ],
  );

  // Data and errors of each API call
  const { data: statsData, error: statsError } = myStats;
  const { data: lastGamesData, error: lastGamesError } = lastGames;
  const { data: pendingGamesData, error: pendingGamesError } = pendingGames;
  const { data: friendsRequestsData, error: friendsRequestsError } =
    friendsRequests;

  // Handle errors for each API call
  if (statsError || !statsData) {
    if (typeof statsError === "string") {
      return ErrorPageText(statsError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  if (lastGamesError || !lastGamesData) {
    if (typeof lastGamesError === "string") {
      return ErrorPageText(lastGamesError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  if (pendingGamesError || !pendingGamesData) {
    if (typeof pendingGamesError === "string") {
      return ErrorPageText(pendingGamesError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  if (friendsRequestsError || !friendsRequestsData) {
    if (typeof friendsRequestsError === "string") {
      return ErrorPageText(friendsRequestsError);
    }
    return ErrorPageText("Erreur Inconnue");
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
          <HorizontalSeparator bg="bg-border mb-2" />
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
          <h2>Résumé de mon profil</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="card card-xs">
              <h4>Parties jouées</h4>
              <p>{total_games_played}</p>
            </div>
            <div className="card card-xs">
              <h4>Victoires</h4>
              <p>{total_wins}</p>
            </div>
            <div className="card card-xs">
              <h4>Fléchettes lancées</h4>
              <p>{total_darts_thrown}</p>
            </div>
            <div className="card card-xs">
              <h4 className="title">Zones favorites</h4>
              {favorite_targets.length === 0 ? (
                <p>
                  <i>Aucune donnée disponible</i>
                </p>
              ) : (
                <p>{favorite_targets.join(" - ")}</p>
              )}
            </div>
            <div className="card col-span-2 md:col-span-2 lg:col-span-4">
              <h3>Dernières parties</h3>
              <p className="subtitle">
                Découvrez vos trois dernières parties et suivez votre
                progression.
              </p>
              <div className="content w-full">
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
          </div>
        </section>
      </main>
    </div>
  );
}
