"use client";

import { useContext } from "react";

import { GameDetail } from "@/utils/types";

import ConfigCard from "../cards/newGame/configCard";
import TargetCard from "../cards/newGame/targetCard";
import PlayersCard from "../cards/newGame/playersCard";

import { UserDataContext } from "@/app/dashboard/providers";
import InfosCard from "../cards/newGame/infosCard";

export default function FinishedGame({ game }: { game: GameDetail }) {
  const { id } = game;

  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  return (
    <>
      <section className="default-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* We pass the userData props to prevent getting data from the providers again */}
          <ConfigCard
            gameId={id}
            gameData={game}
            userData={userData}
            editable={false}
          />
          <TargetCard gameData={game} />
          <InfosCard gameData={game} />
        </div>
      </section>
      <section className="default-section">
        <PlayersCard gameData={game} userData={userData} editable={false} />
      </section>
    </>
  );
}
