"use client";

import { useEffect, useState } from "react";

import CompareWithFriendDialog from "@/components/dialogs/compareWithFriendDialog";
import Dialog from "@/components/dialogs/dialog";

import { getMyStats } from "@/lib/fastapi/players";
import { getPlayer } from "@/lib/fastapi/users";
import { useDialog } from "@/lib/hooks/useDialog";

import { FriendStats, Stats } from "@/utils/types";

function formatNumber(value?: number, digits = 0) {
  if (value === undefined || value === null) return "0";
  return value.toLocaleString("fr-FR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function formatDate(date?: string | Date) {
  if (!date) return "Inconnue";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Inconnue";
  return parsed.toLocaleDateString("fr-FR");
}

function CompareStatRow({
  label,
  myValue,
  friendValue,
  higherIsBetter = true,
  suffix,
  precision = 0,
}: {
  label: string;
  myValue: number;
  friendValue: number;
  higherIsBetter?: boolean;
  suffix?: string;
  precision?: number;
}) {
  const leftWins = higherIsBetter
    ? myValue > friendValue
    : myValue < friendValue;
  const rightWins = higherIsBetter
    ? friendValue > myValue
    : friendValue < myValue;
  const isTie = myValue === friendValue;

  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 border-b border-border last:border-b-0 text-foreground-soft">
      <p
        className={`text-left font-medium text-xl ${leftWins ? "text-brand font-black" : ""}`}
      >
        {formatNumber(myValue, precision)}
        {suffix || ""}
      </p>

      <div className="flex flex-col items-center gap-1">
        <p className="text-sm-2 font-medium text-foreground-soft text-center uppercase">
          {label}
        </p>
        <p className="text-xs-2 text-foreground-soft">
          {isTie ? "Égalité" : leftWins ? "Vous" : "Ami"}
        </p>
      </div>

      <p
        className={`text-right font-medium text-xl ${rightWins ? "text-brand font-black" : ""}`}
      >
        {formatNumber(friendValue, precision)}
        {suffix || ""}
      </p>
    </li>
  );
}

function CompareTextRow({
  label,
  myValue,
  friendValue,
}: {
  label: string;
  myValue?: string;
  friendValue?: string;
}) {
  return (
    <li className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 border-b border-border last:border-b-0">
      <p className="text-left font-medium truncate">{myValue || "Aucune"}</p>
      <p className="text-sm-2 font-medium text-foreground-soft text-center uppercase">
        {label}
      </p>
      <p className="text-right font-medium truncate">
        {friendValue || "Aucune"}
      </p>
    </li>
  );
}

export default function Compare() {
  const [myData, setMyData] = useState<Stats | null>(null);
  const [friendData, setFriendData] = useState<FriendStats | null>(null);

  const dialogControls = useDialog();

  // Open the dialog on the first render of the component to show the user the compare with friend dialog directly when he arrives on this page without needing to click on a button to open the dialog
  useEffect(() => {
    dialogControls.open();
  }, []);

  const getData = async (username: string) => {
    const myRes = await getMyStats();
    const friendRes = await getPlayer(username);

    const { data: myStatsData, error: myStatsError } = myRes;
    const { data: friendData, error: friendError } = friendRes;

    if (myStatsError || !myStatsData) {
      if (typeof myStatsError === "string") {
        alert("Error: " + myStatsError);
      } else {
        alert(
          "Error: Erreur Inconnue lors de la récupération de vos statistiques",
        );
      }
      return;
    }

    if (friendError || !friendData) {
      if (typeof friendError === "string") {
        alert("Error: " + friendError);
      } else {
        alert(
          "Error: Erreur Inconnue lors de la récupération des statistiques de votre ami",
        );
      }
      return;
    }

    setMyData(myStatsData);
    setFriendData(friendData);
  };

  const friendStats = friendData?.stats;

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="mb-0">Me comparer</h1>
        </div>

        <main className="main-container">
          <div className="card">
            <h3>Duel de stats</h3>
            <p className="subtitle">
              Comparez vous point par point avec votre ami. À gauche, vos
              performances. À droite, celles de votre ami.
            </p>

            <div className="content grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="text-left">
                <p className="text-sm-2 uppercase font-medium text-foreground-soft">
                  Moi
                </p>
                <p className="text-lg font-bold">Vous</p>
              </div>

              <p className="badge badge-outline-brand text-xs-2 uppercase">
                VS
              </p>

              <div className="text-right">
                <p className="text-sm-2 uppercase font-medium text-foreground-soft">
                  Ami
                </p>
                <p className="text-lg font-bold truncate">
                  {friendData?.name || "Non sélectionné"}
                </p>
              </div>
            </div>
          </div>

          {!myData || !friendData || !friendStats ? (
            <div className="card">
              <h3>Sélection de l’ami</h3>
              <p className="subtitle">
                Choisissez un ami pour afficher la comparaison complète.
              </p>
              <div className="footer self-start!">
                <button className="btn btn-brand" onClick={dialogControls.open}>
                  Choisir un ami
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                <div className="card card-xs">
                  <h4>Parties jouées</h4>
                  <p>
                    {myData.total_games_played}{" "}
                    <span className="font-bold text-sm-2 text-foreground-soft">
                      vs
                    </span>{" "}
                    {friendStats.total_games_played}
                  </p>
                </div>

                <div className="card card-xs">
                  <h4>Victoires</h4>
                  <p>
                    {myData.total_wins}{" "}
                    <span className="font-bold text-sm-2 text-foreground-soft">
                      vs
                    </span>{" "}
                    {friendStats.total_wins}
                  </p>
                </div>

                <div className="card card-xs">
                  <h4>Taux de victoire</h4>
                  <p>
                    {formatNumber(myData.win_rate_percentage, 1)}%{" "}
                    <span className="font-bold text-sm-2 text-foreground-soft">
                      vs
                    </span>{" "}
                    {formatNumber(friendStats.win_rate_percentage, 1)}%
                  </p>
                </div>

                <div className="card card-xs">
                  <h4>Moyenne / fléchette</h4>
                  <p>
                    {formatNumber(myData.average_points_per_dart, 2)}{" "}
                    <span className="font-bold text-sm-2 text-foreground-soft">
                      vs
                    </span>{" "}
                    {formatNumber(friendStats.average_points_per_dart, 2)}
                  </p>
                </div>

                <div className="card card-xs">
                  <h4>Fléchettes lancées</h4>
                  <p>
                    {myData.total_darts_thrown}{" "}
                    <span className="font-bold text-sm-2 text-foreground-soft">
                      vs
                    </span>{" "}
                    {formatNumber(friendStats.total_darts_thrown, 0)}
                  </p>
                </div>
              </div>

              <div className="card">
                <h3>Comparaison détaillée</h3>
                <p className="subtitle">
                  Le meilleur score est surligné en bleu pour chaque ligne.
                </p>

                <div className="content grid grid-cols-[1fr_auto_1fr] items-center gap-3 pb-2 border-b border-border">
                  <p className="text-left text-sm-2 uppercase font-medium text-foreground-soft">
                    Moi
                  </p>
                  <p className="text-center text-sm-2 uppercase font-medium text-foreground-soft">
                    Indicateur
                  </p>
                  <p className="text-right text-sm-2 uppercase font-medium text-foreground-soft">
                    Ami
                  </p>
                </div>

                <ul className="mt-0!">
                  <CompareStatRow
                    label="Parties jouées"
                    myValue={myData.total_games_played}
                    friendValue={friendStats.total_games_played}
                  />
                  <CompareStatRow
                    label="Victoires"
                    myValue={myData.total_wins}
                    friendValue={friendStats.total_wins}
                  />
                  <CompareStatRow
                    label="Taux de victoire"
                    myValue={myData.win_rate_percentage}
                    friendValue={friendStats.win_rate_percentage}
                    suffix="%"
                    precision={1}
                  />
                  <CompareStatRow
                    label="Moyenne / fléchette"
                    myValue={myData.average_points_per_dart}
                    friendValue={friendStats.average_points_per_dart}
                    precision={2}
                  />
                  <CompareStatRow
                    label="Fléchettes lancées"
                    myValue={myData.total_darts_thrown}
                    friendValue={friendStats.total_darts_thrown}
                  />
                  <CompareStatRow
                    label="Ratés"
                    myValue={myData.total_misses}
                    friendValue={friendStats.total_misses}
                    higherIsBetter={false}
                  />
                  <CompareStatRow
                    label="Total T20"
                    myValue={myData.total_triple_20}
                    friendValue={friendStats.total_triple_20}
                  />
                  <CompareStatRow
                    label="Total 180"
                    myValue={myData.total_180s}
                    friendValue={friendStats.total_180s}
                  />
                  <CompareStatRow
                    label="Scores 100+"
                    myValue={myData.total_100_plus}
                    friendValue={friendStats.total_100_plus}
                  />
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <div className="card">
                  <h3>Spécificités de jeu</h3>
                  <p className="subtitle">
                    Comparaison des tendances de ciblage.
                  </p>

                  <ul className="content">
                    <CompareTextRow
                      label="Zone maudite"
                      myValue={myData.cursed_target || "Aucune"}
                      friendValue={friendStats.cursed_target || "Aucune"}
                    />
                    <CompareTextRow
                      label="Top 1 favori"
                      myValue={myData.favorite_targets?.[0] || "Aucune"}
                      friendValue={
                        friendStats.favorite_targets?.[0] || "Aucune"
                      }
                    />
                    <CompareTextRow
                      label="Top 2 favori"
                      myValue={myData.favorite_targets?.[1] || "Aucune"}
                      friendValue={
                        friendStats.favorite_targets?.[1] || "Aucune"
                      }
                    />
                    <CompareTextRow
                      label="Top 3 favori"
                      myValue={myData.favorite_targets?.[2] || "Aucune"}
                      friendValue={
                        friendStats.favorite_targets?.[2] || "Aucune"
                      }
                    />
                  </ul>
                </div>

                <div className="card">
                  <h3>Profil du duel</h3>
                  <p className="subtitle">
                    Informations de profil utiles à la comparaison.
                  </p>

                  <ul className="content">
                    <CompareTextRow
                      label="Nom"
                      myValue="Vous"
                      friendValue={friendData.name}
                    />
                    <CompareTextRow
                      label="Pseudo"
                      myValue="Moi"
                      friendValue={`@${friendData.username}`}
                    />
                    <CompareTextRow
                      label="Âge"
                      myValue="-"
                      friendValue={`${friendData.age || "-"}`}
                    />
                    <CompareTextRow
                      label="Compte créé"
                      myValue="-"
                      friendValue={formatDate(friendData.creation_date)}
                    />
                  </ul>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <Dialog width="w-5/6 max-w-150" dialogControls={dialogControls}>
        <CompareWithFriendDialog
          dialogControls={{
            ...dialogControls,
            enter: ({ username }: { username?: string }) =>
              username && getData(username),
          }}
        />
      </Dialog>
    </>
  );
}
