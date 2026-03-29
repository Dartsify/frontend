import { Crown, Plus, X } from "lucide-react";

import { isHost } from "@/utils/games";
import { GameDetail, Participant, User } from "@/utils/types";

import HorizontalSeparator from "@/components/horizontalSeparator";

import { removePlayer } from "@/lib/fastapi/games";

export default function PlayersCard({
  gameData,
  userData,
}: {
  gameData: GameDetail | null;
  userData: User | null;
}) {
  const { participations, id } = gameData ?? {};

  const userIsHost = isHost(participations || [], userData);

  const handleAddPlayers = () => {
    alert(
      "Cette fonctionnalité n'est pas encore implémentée. En attendant, les joueurs peuvent rejoindre la partie en partageant le lien de la partie avec leurs amis !",
    );
  };

  const handleShowUserControls = (player: Participant) => {
    alert(
      `Vous pourrez bientôt avoir directement ici des infos sur ${player.player_name} (@${player.player_username}) !`,
    );
  };

  const handleRemovePlayer = async (username: string) => {
    // We are sure that id is defined bc we get the gameData from the gameId (and we set it in the gameData state in case of success)
    const { data, error } = await removePlayer(id!, username); // Remove player from the game with his username

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
    const {
      player_name,
      player_username,
      status,
      checkout_suggestion,
      position,
      is_host,
    } = item;

    const isMe = player_username === userData?.username;

    const victories = (Math.random() * 100) | 0;
    const games = 100;
    const ratio = victories / games;

    const userIsGuest = player_username.includes("guest_");

    const showUserControls = !isMe && !userIsGuest;

    return (
      <li key={index} className="">
        <div className="flex justify-between items-center py-1">
          {/* <div className="flex items-center gap-1.5">
            <p
              onClick={() => (!isMe ? handleShowUserControls(item) : null)}
              className={`${!isMe && "cursor-pointer hover:text-brand duration-300 transition-colors"}`}
            >
              <b className="">{player_name}</b> (
              {player_username == userData?.username
                ? "Vous"
                : "@" + player_username}
              )
              • {(Math.random() * 100) | 0} victoires,{" "}
              {(Math.random() * 100) | 0} défaites
              <br />
              <span className="text-foreground-soft text-sm-2 font-medium">
                {(Math.random() * 100) | 0} victoires,{" "}
                {(Math.random() * 100) | 0} défaites
              </span>
            </p>
            {is_host && <Crown size={16} className="text-yellow-500" />}
          </div> */}

          <div className="">
            <p
              onClick={() =>
                showUserControls ? handleShowUserControls(item) : null
              }
              className={`${showUserControls && "cursor-pointer hover:text-brand duration-300 transition-colors"}`}
            >
              <b className="">{player_name}</b> (
              {isMe ? "Vous" : userIsGuest ? "Invité" : "@" + player_username})
            </p>
            <p className="text-foreground-soft text-sm-2 font-medium -mt-0.5">
              {ratio.toFixed(2)} ({victories} victoires, {games} parties)
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
    <div className="card">
      <div className="flex justify-between items-center">
        <h4 className="title">Joueurs</h4>
        {userIsHost && (
          <button
            type="button"
            onClick={handleAddPlayers}
            className="btn btn-neutral btn-sm -mt-2"
          >
            <Plus size={16} /> Ajouter des joueurs
          </button>
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
  );
}
