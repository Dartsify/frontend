"use client";

import { utcConvert } from "@/utils/dates";
import { GameDetail } from "@/utils/types";
import ConfigCard from "../cards/newGame/configCard";
import TargetCard from "../cards/newGame/targetCard";
import { useContext } from "react";
import { UserDataContext } from "@/app/dashboard/providers";
import PlayersCard from "../cards/newGame/playersCard";

export default function FinishedGame(game: GameDetail) {
  const {
    id,
    participations,
    mode,
    start_date,
    end_date,
    creation_date,
    target_location,
    target_name,
  } = game;

  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  return (
    <div className="flex flex-col gap-3">
      <section className="default-section">
        <div className="grid grid-cols-2 gap-3">
          {/* We pass the userData props to prevent getting data from the providers again */}
          <ConfigCard
            gameId={id}
            gameData={game}
            userData={userData}
            editable={false}
          />
          <TargetCard gameData={game} />
        </div>
      </section>
      <section className="default-section">
        <PlayersCard gameData={game} userData={userData} editable={false} />
      </section>
    </div>
  );
}
