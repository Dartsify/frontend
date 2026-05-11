import { useEffect } from "react";
import { Crown, Medal, Plus, X } from "lucide-react";

import { isHost } from "@/utils/games";
import { GameDetail, Participant, User } from "@/utils/types";
import { userIsGuest } from "@/utils/users";

import HorizontalSeparator from "@/components/horizontalSeparator";
import IconButton from "@/components/buttons/actionButtons/iconButton";
import Dialog from "@/components/dialogs/dialog";
import AddPlayersToGameDialog from "@/components/dialogs/addPlayersToGameDialog";
import PlayerName from "@/components/playerName";

import { removePlayer } from "@/lib/fastapi/games";
import { useDialog } from "@/lib/hooks/useDialog";

export default function PlayersCard({
  gameData,
  userData,
  editable = true,
}: {
  gameData: GameDetail | null;
  userData: User | null;
  editable?: boolean;
}) {
  const { id, status: gameStatus } = gameData ?? {};

  // Index of the winner (the player with the position 1 in the participations array)
  const winnerIndex = gameData?.participations?.findIndex(
    (participation) => participation.position === 1,
  );

  const baseParticipations = gameData?.participations ?? [];

  // We check if the game is finished and if there is a winner
  //  - Yes -> we sort the participations array to put the winner at the top
  //  - No -> we keep the original order
  const participations =
    gameStatus === "finished" && winnerIndex !== undefined && winnerIndex !== -1
      ? [
          baseParticipations[winnerIndex],
          ...baseParticipations.filter((_, index) => index !== winnerIndex),
        ]
      : gameData?.participations;

  const userIsHost = isHost(participations || [], userData);

  const dialogControls = useDialog(); // Controls for the add player dialog

  const handleAddPlayers = () => {
    dialogControls.open();
  };

  if (id === undefined || id === null) {
    return;
  }

  const handleRemovePlayer = async (username: string) => {
    const { data, error } = await removePlayer(id, username); // Remove player from the game with his username

    if (error) {
      if (typeof error === "string") {
        alert(error);
        return;
      }
      alert(
        "Une erreur est survenue lors de la suppression du joueur. Veuillez réessayer.",
      );
      return;
    }

    // We dont show success message bc the change is directly visible in the UI with the update of the participations
  };

  const listItem = (item: Participant, index: number) => {
    const { player_name, player_username, status, is_host } = item;

    const isMe = player_username === userData?.username;

    return (
      <li key={index} className="">
        <div className="flex justify-between items-center py-1">
          <div className="flex items-center gap-2">
            {/* {winner === index && (
              <Medal size={16} className="text-yellow-500 m-1" />
            )} */}
            {/* {gameStatus === "finished" && index === 0 && (
              // <Medal size={16} className="text-yellow-500 m-1" />
              <p className="text-xl font-black">1.</p>
            )} */}
            <div>
              <PlayerName
                player={item}
                myUsername={userData?.username || ""}
                showUsername={false}
              />
              <p className="text-foreground-soft text-sm font-medium -mt-1">
                {userIsGuest(player_username)
                  ? "Invité"
                  : `@${player_username}`}
              </p>
            </div>
            {/* {gameStatus === "finished" && index === 0 && (
              <Medal size={20} className="text-yellow-500 m-1" />
            )} */}
          </div>

          <div className="flex items-center gap-2">
            {gameStatus === "finished" && index === 0 && (
              <Medal
                size={18}
                className="text-yellow-500 m-1"
                strokeWidth={2.2}
              />
            )}
            {is_host && (
              <Crown
                size={18}
                className="text-yellow-500 m-1"
                strokeWidth={2.2}
              />
            )}

            {userIsHost && !isMe && editable && (
              <button
                type="button"
                className="btn btn-xs btn-ghost btn-destructive-hover group"
                onClick={() => handleRemovePlayer(player_username)}
              >
                {" "}
                <X
                  size={16}
                  className="stroke-red-500 group-hover:stroke-foreground-light transition-colors duration-300"
                />
              </button>
            )}
          </div>
        </div>

        {participations && index !== participations.length - 1 && (
          <HorizontalSeparator my="my-1" />
        )}
      </li>
    );
  };

  return (
    <>
      <div className="card">
        <div className="flex justify-between items-center">
          <h3>Joueurs</h3>
          {userIsHost && editable && (
            <IconButton
              title="Ajouter des joueurs"
              icon={<Plus size={16} />}
              onClick={handleAddPlayers}
            />
          )}
        </div>

        <div className="content mt-3">
          {participations ? (
            <ul className="mt-1">
              {participations.map((item, index) => listItem(item, index))}
            </ul>
          ) : (
            <p>
              <i>Aucun joueur pour le moment</i>
            </p>
          )}
        </div>
      </div>

      <Dialog width="w-5/6 max-w-150" dialogControls={dialogControls}>
        <AddPlayersToGameDialog
          dialogControls={dialogControls}
          participations={participations}
          gameId={id}
          participants={participations}
        />
      </Dialog>
    </>
  );
}
