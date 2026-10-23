import { useEffect, useState } from "react";

import Selector from "@/components/selector";

import { setGameMode } from "@/lib/fastapi/games";
import { useSelector } from "@/lib/hooks/useSelector";

import { gameHostName, gameNames, games, isHost } from "@/utils/games";
import { GameDetail, User } from "@/utils/types";

// Party Config Card shown in the lobby of a game,
// it allows the host to change the game mode and shows some information about the party (host, game mode, etc.)
export default function ConfigCard({
  gameId,
  gameData,
  userData,
  editable = true, // If editable is false, the host cannot change the game mode (used for the finished game page)
}: {
  // If gameId is undefined, it means we haven't created a game yet
  // If gameData is null, it means we haven't loaded the data of the game yet (it can be because we just created the game and we are waiting for the response, or because we are loading the data of an existing game that we joined or bc we need to choose the target id and join)
  // If userData is null, it means we are not logged in
  gameId: number | undefined;
  gameData: GameDetail | null;
  userData: User | null;
  editable?: boolean;
}) {
  // Set the default selected index of the game mode selector to 0 (which corresponds to the first game mode in the list) when the component is mounted
  const selectorControls = useSelector(
    gameData?.mode ? games.findIndex((g) => g.slug === gameData.mode) : 0, // If gameData.mode is defined, we find the index of the corresponding game mode in the games array, otherwise we set it to 0 (first game mode in the list)
  );
  const { selectedIndex } = selectorControls;

  const { participations, mode } = gameData ?? {};

  const [updateGameModeError, setUpdateGameModeError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Each time the user changes the selected game mode, we update the game data to show the corresponding target data of the selected game mode for all the users in the lobby
    // updateGameMode();
    if (selectedIndex !== null && gameId !== undefined && mode !== undefined) {
      if (mode !== games[selectedIndex].slug) {
        updateGameMode();
      }
    }
  }, [selectedIndex, gameId, mode]);

  const updateGameMode = async () => {
    // '!' bc we are sure that gameId is defined when we can change the game mode (the selector is only shown when gameData is loaded, which means gameId is set)
    const res = await setGameMode(gameId!, games[selectedIndex!].slug);

    const { data, error } = res;

    if (error || !data) {
      console.error("Error updating game mode:", error);
      if (typeof error === "string") {
        setUpdateGameModeError(error);
        return;
      }
      setUpdateGameModeError(
        "Une erreur est survenue lors de la mise à jour du mode de jeu. Veuillez réessayer.",
      );
      return;
    }
  };

  const userIsHost = isHost(gameData?.participations || [], userData);

  return (
    <div className="card">
      <h3>Configuration</h3>
      <p className="subtitle">
        L'hôte de la partie peut personnaliser les paramètres de la partie.
      </p>
      <ul className="content">
        <li>
          <b>Chef de partie :</b>{" "}
          {userIsHost
            ? "Vous"
            : gameHostName(gameData?.participations || []).name}
          {/* gameHostName return "Inconnu" if the name is not found (so ok if gameData is null) */}
        </li>
        {userIsHost && editable ? (
          <li className="">
            <div className="flex gap-1.5 items-center">
              <b>Mode de jeu :</b>{" "}
              <Selector
                options={gameNames}
                selectorControls={selectorControls}
              />
            </div>
            {updateGameModeError && (
              <span className="text-red-500">{updateGameModeError}</span>
            )}
          </li>
        ) : (
          <li>
            <b>Mode de jeu :</b> {mode || "N/A"}
          </li>
        )}
      </ul>
    </div>
  );
}
