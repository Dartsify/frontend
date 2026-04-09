import { useEffect } from "react";
import { Crown, Plus, X } from "lucide-react";

import { isHost } from "@/utils/games";
import { GameDetail, Participant, User } from "@/utils/types";

import HorizontalSeparator from "@/components/horizontalSeparator";
import IconButton from "@/components/buttons/actionButtons/iconButton";
import Dialog from "@/components/dialogs/dialog";
import AddPlayersToGameDialog from "@/components/dialogs/addPlayersToGameDialog";

import { removePlayer } from "@/lib/fastapi/games";
import { useDialog } from "@/lib/hooks/useDialog";
import PlayerName from "@/components/playerName";
import { userIsGuest } from "@/utils/users";

export default function PlayersCard({
  gameData,
  userData,
}: {
  gameData: GameDetail | null;
  userData: User | null;
}) {
  const { participations, id } = gameData ?? {};

  useEffect(() => {
    console.log("gameData changed:", gameData);
  }, [gameData]);

  const userIsHost = isHost(participations || [], userData);

  const dialogControls = useDialog(); // Controls for the add player dialog

  const handleAddPlayers = () => {
    dialogControls.open();
  };

  if (id === undefined || id === null) {
    return <></>;
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
    const { player_name, player_username, status, position, is_host } = item;

    const isMe = player_username === userData?.username;

    const victories = (Math.random() * 100) | 0;
    const games = 100;
    const ratio = victories / games;

    return (
      <li key={index} className="">
        <div className="flex justify-between items-center py-1">
          <div className="">
            <PlayerName
              player={item}
              myUsername={userData?.username || ""}
              showUsername={false}
            />
            {/* {!userIsGuest(player_username) && (
              <p className="text-foreground-soft text-sm-2 font-medium -mt-0.5">
                {ratio.toFixed(2)} ({victories} victoires, {games} parties)
              </p>
            )} */}
            <p className="text-foreground-soft text-sm-2 font-medium -mt-1">
              {userIsGuest(player_username) ? "Invité" : `@${player_username}`}
            </p>
          </div>

          {userIsHost && !isMe && (
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
          {is_host && <Crown size={16} className="text-yellow-500 m-1" />}
        </div>

        {participations && index !== participations.length - 1 && (
          <HorizontalSeparator bg="bg-background" />
        )}
      </li>
    );
  };

  return (
    <>
      <div className="card">
        <div className="flex justify-between items-center">
          <h4 className="title">Joueurs</h4>
          {userIsHost && (
            <IconButton
              title="Ajouter des joueurs"
              icon={<Plus size={16} />}
              onClick={handleAddPlayers}
            />
          )}
        </div>

        {participations ? (
          <ul className="mt-1">
            {participations
              .toReversed()
              .map((item, index) => listItem(item, index))}
          </ul>
        ) : (
          <p>Aucun joueur pour le moment</p>
        )}
      </div>

      <Dialog width="w-150" dialogControls={dialogControls}>
        <AddPlayersToGameDialog
          dialogControls={dialogControls}
          participations={participations}
          gameId={id}
        />
      </Dialog>
    </>
  );
}
