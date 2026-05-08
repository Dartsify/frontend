"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { UserDataContext } from "../providers";

import { useDialog } from "@/lib/hooks/useDialog";
import { useGameStream } from "@/lib/hooks/useGameStream";
import { leaveGame, startGame } from "@/lib/fastapi/games";

import Dialog from "@/components/dialogs/dialog";
import LoginDialog from "@/components/dialogs/loginDialog";
import TargetDialog from "@/components/dialogs/targetDialog";
import ConfigCard from "@/components/cards/newGame/configCard";
import TargetCard from "@/components/cards/newGame/targetCard";
import PlayersCard from "@/components/cards/newGame/playersCard";

import { isHost } from "@/utils/games";
import { GameMode } from "@/utils/types";
import ErrorPageText from "@/components/errorPageText";

const LEAVE_PAGE_WARNING_DEFAULT =
  "Êtes-vous sûr de vouloir quitter cette page ? Vous devrez rejoindre la partie depuis la page Mes Parties.";

const LEAVE_PAGE_WARNING_HOST =
  "Êtes-vous sûr de vouloir quitter cette page en tant qu'hôte ? Vous devrez rejoindre la partie depuis la page Mes Parties afin de lancer la partie.";

export default function NewGame() {
  // Params used for retrieving data of a game id
  // Specially when we come from the "Mes Parties" page and want to show the lobby of an already created game
  const searchParams = useSearchParams();
  const game = searchParams.get("game");
  const mode = searchParams.get("mode");

  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const router = useRouter();
  const hasRedirectedToGame = useRef(false);
  const allowProgrammaticNavigation = useRef(false);

  const [gameId, setGameId] = useState<number | undefined>(undefined);

  const [mounted, setMounted] = useState<boolean>(false);

  const dialogControls_target = useDialog();
  const dialogControls_login = useDialog();

  const {
    gameData,
    loading: loadingGameData,
    error: gameError,
    isConnected,
  } = useGameStream(gameId);

  // Redirect the user to the game page when game starts
  const redirectTo = (href: string) => {
    if (gameId == null || hasRedirectedToGame.current) return;

    hasRedirectedToGame.current = true;
    allowProgrammaticNavigation.current = true;

    router.replace(href);

    // Fallback: force browser navigation if client router transition is ignored.
    // ! Don't know why but router.replace is ignored
    window.setTimeout(() => {
      if (window.location.pathname.startsWith("/dashboard/new-game")) {
        window.location.assign(href);
      }
    }, 120);
  };

  // When the game starts, redirect all the users (host and players) to the game page
  useEffect(() => {
    if (gameData?.status === "in_progress") {
      redirectTo(`/dashboard/my-games/${gameId}`);
    } else if (gameData?.status === "finished") {
      // The game has been finished
      redirectTo(`/dashboard/my-games/${gameId}`);
    }
  }, [gameData?.status, gameId, router]);

  // We want to execute this effect only once on mount to show the target dialog
  // Show the target dialog & set game id if we have it in the query params
  useEffect(() => {
    if (gameId == null && !game) {
      // Show the target dialog to let the user create or join a game if we don't have a game id
      dialogControls_target.open();
      setMounted(true);
    }
    if (game) {
      // If we have a game id in the query params, it means we come from the "Mes Parties" page and we want to show the lobby of this game, so we set the game id to fetch the data of the game and show the lobby page
      setGameId(parseInt(game));
      setMounted(true);
    }
  }, []);

  // Prevent accidental leave while a game is active (reload/close/navigation).
  useEffect(() => {
    if (gameId == null) {
      return;
    }

    // We calculate once the userIsHost variable to avoid calling the isHost function multiple times in the event listeners
    const userIsHost = isHost(gameData?.participations || [], userData);

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // If we have accepted to navigate programmatically (after leaving the game or after starting the game), we don't show the warning and we let the navigation happen
      if (allowProgrammaticNavigation.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    const handleDocumentClick = (event: MouseEvent) => {
      // If we have accepted to navigate programmatically (after leaving the game or after starting the game), we don't show the warning and we let the navigation happen
      if (allowProgrammaticNavigation.current) {
        return;
      }

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
        userIsHost ? LEAVE_PAGE_WARNING_HOST : LEAVE_PAGE_WARNING_DEFAULT,
      );
      if (!shouldLeave) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handlePopState = () => {
      // If we have accepted to navigate programmatically (after leaving the game or after starting the game), we don't show the warning and we let the navigation happen
      if (allowProgrammaticNavigation.current) {
        return;
      }

      // 2 messages according to the user role
      const shouldLeave = window.confirm(
        userIsHost ? LEAVE_PAGE_WARNING_HOST : LEAVE_PAGE_WARNING_DEFAULT,
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

  // Go back to dashboard if we close the target dialog without having a game id
  useEffect(() => {
    // When the target dialog is closed, if we don't have a target id (which means the user didn't create or join a game) and the component is mounted, we go back to the dashboard
    // Mounted is necessary to avoid going back to the dashboard on mount (before showing the target dialog in the use effect)
    if (!dialogControls_target.isOpen && !gameId && mounted) {
      router.push("/dashboard");
    }
  }, [dialogControls_target.isOpen, mounted]);

  // Store if the user is the host of the game in a variable to avoid calling the isHost function multiple times
  const userIsHost = isHost(gameData?.participations || [], userData);

  const handleLeaveGame = async () => {
    // If the user is the host, leaving the game means canceling it
    // If the user is not the host, he only leaves the game but it continues for the other players
    const shouldLeave = window.confirm(
      // Show a diff message if the user is the host or not because leaving the game has different consequences
      userIsHost
        ? "Êtes-vous sûr de vouloir supprimer cette partie ? Tous les joueurs seront également déconnectés. Cette action est irréversible."
        : "Êtes-vous sûr de vouloir quitter cette partie ?",
    );

    if (shouldLeave) {
      const res = await leaveGame(gameId!);

      const { data, error } = res;

      if (error || !data) {
        alert(
          typeof error === "string"
            ? error
            : "Une erreur est survenue lors de la tentative de quitter la partie.",
        );
        return;
      }

      redirectTo(`/dashboard`);
    }
  };

  // Handle Start the game
  const handleStartGame = async () => {
    if (gameId === undefined) return;

    const res = await startGame(gameId);
    const { error } = res;

    if (error) {
      // If the error is about the game already started, it means the game has been started by another player (in case of multiple hosts or in case of a delay between the click on start and the actual start of the game), so we redirect to the game page instead of showing an error
      if (
        typeof error === "string" &&
        /already|already started|deja|déjà/i.test(error)
      ) {
        redirectTo(`/dashboard/my-games/${gameId}`);
        return;
      }

      alert(
        typeof error === "string"
          ? error
          : "Une erreur est survenue lors de la tentative de démarrer la partie.",
      );
      return;
    }
  };

  if (loadingGameData) {
    return <p>Chargement en cours...</p>;
  }

  // If an error has been set show error
  if (gameError) {
    if (typeof gameError === "string") {
      return ErrorPageText(gameError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  return (
    <>
      <div>
        <header className="flex flex-col md:flex-row justify-between items-center">
          <h1>Nouvelle partie</h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleLeaveGame}
              type="button"
              className="btn btn-destructive-soft"
            >
              {userIsHost ? "Supprimer la partie" : "Quitter"}
            </button>

            {/* We only show the start game button if the user is the host */}
            {userIsHost && (
              <button
                onClick={handleStartGame}
                type="button"
                className="btn btn-brand"
              >
                Démarrer la partie
              </button>
            )}
          </div>
        </header>

        <main className="main-container gap-3">
          <section className="default-section">
            {!userData && (
              <div className="card card-sm">
                <h4>Mode invité</h4>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* We pass the userData props to prevent getting data from the providers again */}
              <ConfigCard
                gameId={gameId}
                gameData={gameData}
                userData={userData}
              />
              <TargetCard gameData={gameData} />
            </div>
          </section>
          <section className="default-section">
            <PlayersCard gameData={gameData} userData={userData} />
          </section>
        </main>
      </div>

      <Dialog width="w-5/6 max-w-150" dialogControls={dialogControls_target}>
        <TargetDialog
          dialogControls={{
            ...dialogControls_target,
            // This function will be called after successfully creating or joining a game in the TargetDialog
            enter: ({ id }: { id?: number }) => setGameId(id),
          }}
          defaultMode={(mode as GameMode) || undefined}
        />
      </Dialog>

      <Dialog width="w-5/6 max-w-150" dialogControls={dialogControls_login}>
        <LoginDialog dialogControls={dialogControls_login} />
      </Dialog>
    </>
  );
}
