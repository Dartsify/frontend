"use client";

import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../providers";
import { useDialog } from "@/lib/hooks/useDialog";
import Dialog from "@/components/dialogs/dialog";
import LoginDialog from "@/components/dialogs/loginDialog";
import TargetDialog from "@/components/dialogs/targetDialog";
import { useRouter } from "next/navigation";
import { getGame } from "@/lib/fastapi/games";
import { GameDetail, Participant } from "@/utils/types";

export default function NewGame() {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const router = useRouter();

  // const [targetId, setTargetId] = useState<string | null | undefined>(null);
  const [gameId, setGameId] = useState<number | undefined>(undefined);
  const [gameData, setGameData] = useState<GameDetail | null>(null);
  const [gameError, setGameError] = useState<string | null>(null);

  const [mounted, setMounted] = useState<boolean>(false);

  const dialogControls_target = useDialog();
  const dialogControls_login = useDialog();

  useEffect(() => {
    // We want to execute this effect only once on mount to show the target dialog
    if (gameId == null) {
      dialogControls_target.open();
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    // Prevent accidental tab close/reload while a game is active !
    if (gameId == null) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameId]);

  useEffect(() => {
    // When the target dialog is closed, if we don't have a target id (which means the user didn't create or join a game) and the component is mounted, we go back to the dashboard
    // Mounted is necessary to avoid going back to the dashboard on mount (before showing the target dialog in the use effect)
    if (!dialogControls_target.isOpen && !gameId && mounted) {
      router.push("/dashboard");
    }
  }, [dialogControls_target.isOpen, mounted]);

  // gameId is set after successfully creating or joining a game in the TargetDialog
  // We want to get the data of the party
  useEffect(() => {
    if (gameId) {
      handleGetGame();
    }
  }, [gameId]);

  const handleGetGame = async () => {
    // The "!" means we are sure that gameId is not undefined here because this function is only called if gameId is set
    const res = await getGame(gameId!);

    const { data, error } = res;

    if (error || !data) {
      if (typeof error === "string") {
        setGameError(error);
      } else {
        setGameError(
          "Une erreur est survenue en récupérant les données de la partie.",
        );
      }
    } else {
      setGameData(data);
    }
  };

  // Cancel the active game -> show a prevent message and go back if the user confirms
  const handleCancel = () => {
    alert(
      "Êtes-vous sûr de vouloir quitter la partie ? Votre progression ne sera pas sauvegardée.",
    );
  };

  const handleStart = () => {
    // Implementation for starting the game
  };

  const listItem = (item: Participant, index: number) => {
    const {
      player_name,
      player_username,
      status,
      checkout_suggestion,
      position,
    } = item;
    return (
      <li key={index}>
        <b>
          {player_name} ({player_username})
        </b>{" "}
        - Score: {item.current_score} - Position: {position || "N/A"} - Status:{" "}
        {status} - Checkout suggestion:{" "}
        {item.checkout_suggestion.join(", ") || "None"}
      </li>
    );
  };

  return (
    <>
      <div>
        <header className="flex justify-between items-center">
          <h1>Nouvelle partie</h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleCancel}
              type="button"
              className="btn btn-destructive-soft"
            >
              Quitter
            </button>
            <button
              onClick={handleStart}
              type="button"
              className="btn btn-brand"
            >
              Démarrer la partie
            </button>
          </div>
        </header>

        <main className="main-container gap-3">
          <section className="default-section">
            {!userData && (
              <div className="card">
                <h4 className="title">Mode invité</h4>
                <p>
                  Veuillez vous connecter à votre compte si vous souhaitez
                  conserver cette partie dans votre historique.
                </p>
                <div className="footer">
                  <button
                    onClick={dialogControls_login.open}
                    type="button"
                    className="btn btn-sm btn-brand"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            )}
          </section>
          <section className="default-section">
            <div className="grid grid-cols-2 gap-3">
              <div className="card">
                <h4 className="title">Configuration</h4>
                <ul>
                  <li>
                    <b>Chef de partie :</b> Mathias
                  </li>
                  <li>
                    <b>Mode de jeu :</b> {gameData?.mode || "N/A"}
                  </li>
                </ul>
              </div>
              <div className="card">
                <h4 className="title">Cible</h4>
                <ul>
                  <li>
                    <b>Identifiant :</b> {gameData?.target_id || "N/A"}
                  </li>
                  <li>
                    <b>Description :</b> {gameData?.target_description || "N/A"}
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section className="default-section">
            <div className="card">
              <h4 className="title">Joueurs</h4>
              {gameData?.participations ? (
                <ul>
                  {gameData?.participations.map((item, index) =>
                    listItem(item, index),
                  )}
                </ul>
              ) : (
                <p>Aucun joueur pour le moment</p>
              )}
            </div>
          </section>
        </main>
      </div>

      <Dialog width="w-150" dialogControls={dialogControls_target}>
        <TargetDialog
          dialogControls={{
            ...dialogControls_target,
            // This function will be called after successfully creating or joining a game in the TargetDialog
            enter: ({ id }: { id?: number }) => setGameId(id),
          }}
        />
      </Dialog>

      <Dialog width="w-150" dialogControls={dialogControls_login}>
        <LoginDialog dialogControls={dialogControls_login} />
      </Dialog>
    </>
  );
}
