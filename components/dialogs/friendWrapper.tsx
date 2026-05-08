import { useEffect, useState } from "react";

import { useDialog } from "@/lib/hooks/useDialog";

import Dialog from "./dialog";
import FriendDialog from "./friendDialog";

import { Friend, Participant } from "@/utils/types";

import { getPlayer } from "@/lib/fastapi/users";

// Wrapper component to open the friend dialog with the right data when we click on a friend in the friends list
// The purpose is to avoid having several instances of the FriendDialog in the playerName component (the parent), we show this only if the user clicks on a friend
export default function FriendWrapper({
  friendData,
}: {
  friendData: Participant | null;
}) {
  const dialogControls = useDialog();

  const [playerData, setPlayerData] = useState<Friend | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { is_friend } = friendData || {};

  // We open the dialog when we have the friend data (i.e. when the component is mounted with the friend data after clicking on a friend in the friends list)
  useEffect(() => {
    // We only get the data if the user is a friend
    if (friendData && is_friend && !error) {
      // Here we get the data of the friend we want to show in the dialog
      const fetchData = async () => {
        const res = await getPlayer(friendData.player_username);

        const { data, error } = res;

        if (error) {
          alert(
            typeof error === "string"
              ? error
              : "Une erreur est survenue lors de la récupération des données du joueur. Veuillez réessayer.",
          );
          setError(
            typeof error === "string" ? error : "Une erreur est survenue",
          );
          return;
        }

        setPlayerData(data);

        dialogControls.open();
      };
      fetchData();
    }
  }, [friendData, dialogControls, error]);

  if (!friendData) {
    return null;
  }

  return (
    <Dialog dialogControls={dialogControls}>
      <FriendDialog dialogControls={dialogControls} friendData={playerData} />
    </Dialog>
  );
}
