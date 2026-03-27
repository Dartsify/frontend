"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { UserDataContext } from "../providers";

import { useDialog } from "@/lib/hooks/useDialog";
import { getGame, setGameMode } from "@/lib/fastapi/games";

import Dialog from "@/components/dialogs/dialog";
import LoginDialog from "@/components/dialogs/loginDialog";
import TargetDialog from "@/components/dialogs/targetDialog";
import Selector from "@/components/selector";

import { GameDetail, Participant } from "@/utils/types";
import { gameNames, games } from "@/utils/games";
import { useSelector } from "@/lib/hooks/useSelector";

const LEAVE_PAGE_WARNING_DEFAULT =
  "Êtes-vous sûr de vouloir quitter cette page ? Vous devrez rejoindre la partie depuis la page Mes Parties.";

const LEAVE_PAGE_WARNING_HOST =
  "Êtes-vous sûr de vouloir quitter cette page en tant qu'hôte ? Vous devrez rejoindre la partie depuis la page Mes Parties afin de lancer la partie.";

export default function NewGame() {
  // Params used for retrieving data of a game id
  // Specially when we come from the "Mes Parties" page and want to show the lobby of an already created game
  const searchParams = useSearchParams();
  const game = searchParams.get("game");

  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const router = useRouter();

  const [gameId, setGameId] = useState<number | undefined>(undefined);
  const [gameData, setGameData] = useState<GameDetail | null>(null);
  const [gameError, setGameError] = useState<string | null>(null);

  const [mounted, setMounted] = useState<boolean>(false);

  const dialogControls_target = useDialog();
  const dialogControls_login = useDialog();

  // Set the default selected index of the game mode selector to 0 (which corresponds to the first game mode in the list) when the component is mounted
  const selectorControls = useSelector(0);
  const { selectedIndex } = selectorControls;

  // We want to execute this effect only once on mount to show the target dialog
  useEffect(() => {
    if (gameId == null && !game) {
      dialogControls_target.open();
      setMounted(true);
    }
    if (game) {
      setGameId(parseInt(game));
      setMounted(true);
    }
  }, []);

  // This function checks if the user is the host of the game, it will be used to show a different warning message when the user tries to leave the page
  const isHost = useCallback(() => {
    const host = gameData?.participations.find((p) => p.is_host);
    return userData?.username === host?.player_username && host;
  }, [gameData, userData]);

  // Prevent accidental leave while a game is active (reload/close/navigation).
  useEffect(() => {
    if (gameId == null) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!link) {
        return;
      }

      if (
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) {
        return;
      }

      const destinationUrl = new URL(link.href, window.location.href);
      if (destinationUrl.href === window.location.href) {
        return;
      }

      const shouldLeave = window.confirm(
        isHost() ? LEAVE_PAGE_WARNING_HOST : LEAVE_PAGE_WARNING_DEFAULT,
      );
      if (!shouldLeave) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handlePopState = () => {
      const shouldLeave = window.confirm(
        isHost() ? LEAVE_PAGE_WARNING_HOST : LEAVE_PAGE_WARNING_DEFAULT,
      );
      if (!shouldLeave) {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [gameId, gameData]);

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

  // Handle get the data of the game and set the data (& error if it occurs)
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
    const shouldLeave = window.confirm(
      isHost() ? LEAVE_PAGE_WARNING_HOST : LEAVE_PAGE_WARNING_DEFAULT,
    );
    if (shouldLeave) {
      router.push("/dashboard");
    }
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

  if (gameError || !gameData) {
    if (typeof gameError === "string") {
      return <p>Erreur : {gameError}</p>;
    }
    return <p>Erreur</p>;
  }

  useEffect(() => {
    // Each time the user changes the selected game mode, we update the game data to show the corresponding target data of the selected game mode for all the users in the lobby
    // updateGameMode();
    alert("test");
  }, [selectedIndex]);

  const updateGameMode = async () => {
    // ! bc we are sure that gameId is defined when we can change the game mode (the selector is only shown when gameData is loaded, which means gameId is set)
    const res = await setGameMode(gameId!, games[selectedIndex!].slug);

    const { data, error } = res;

    if (error || !data) {
      console.error("Error updating game mode:", error);
      if (typeof error === "string") {
        setGameError(
          "Une erreur est survenue lors de la mise à jour du mode de jeu. Veuillez réessayer.",
        );
      }
      return;
    }
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
                  <li className="flex gap-1.5 items-center">
                    <b>Mode de jeu :</b>{" "}
                    <Selector
                      options={gameNames}
                      selectorControls={selectorControls}
                    />
                  </li>
                </ul>
              </div>
              <div className="card">
                <h4 className="title">{gameData?.target_name || "Cible"}</h4>
                <ul>
                  <li>
                    <b>Identifiant :</b> {gameData?.target_id || "N/A"}
                  </li>
                  <li>
                    <b>Lieu :</b> {gameData?.target_location || "N/A"}
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
