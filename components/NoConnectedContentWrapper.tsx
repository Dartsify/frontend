"use client";

import { useContext } from "react";
import {
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";

import { useDialog } from "@/lib/hooks/useDialog";

import { routeNames } from "@/utils/routes";

import Dialog from "./dialogs/dialog";
import LoginDialog from "./dialogs/loginDialog";
import PlayGameSection from "./sections/playGameSection";

import { UserDataContext } from "@/app/dashboard/providers";

export default function NoConnectedContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const { guest, name, username } = userData || {};

  const selectedLayoutSegment = useSelectedLayoutSegment();
  const selectedLayoutSegments = useSelectedLayoutSegments();

  const dialogControls = useDialog();

  // !userData means if the user is not logged in and not a guest with a guest token (he has not joined a game yet)
  // guest means if the user is a guest (he has joined a game with a guest token but is not logged in -> he can only access the new game and my games sections)
  if ((!userData || guest) && !selectedLayoutSegments.includes("new-game")) {
    // Means the user has a guest token
    if (!selectedLayoutSegment) {
      // Means we are on the home page of the dashboard
      // Specific NoConnectedContent for home page of the dashboard
      return (
        <>
          <div>
            <header>
              {/* If the user that is a guest with a token, we can show his registered name */}
              <h1>Bonjour {guest && name} 👋</h1>
            </header>
            <main className="main-container">
              <div className="card">
                <h4 className="title">Mode invité</h4>
                {/* If the user is a guest with a guest token, we can add that he alrdeady knows that he can join games */}
                <p>
                  Pas de panique, {guest && <b>comme vous le savez déjà, </b>}
                  vous pouvez <b>jouer sur nos cibles en tant qu'invité</b> !
                  <br />
                  Cependant, afin de profiter de nos fonctionnalités telles que
                  la <b>création de parties en tant qu'hôte</b>, la{" "}
                  <b>visualisation de vos statistiques</b> et la{" "}
                  <b>création de groupes d'amis</b>, veuillez vous connecter.
                </p>
                <div className="footer">
                  <button
                    onClick={dialogControls.open}
                    type="button"
                    className="btn btn-sm btn-brand"
                  >
                    Se connecter
                  </button>
                </div>
              </div>

              <PlayGameSection />
            </main>
          </div>
          <Dialog width="w-150" dialogControls={dialogControls}>
            <LoginDialog dialogControls={dialogControls} />
          </Dialog>
        </>
      );
    }

    if (
      guest &&
      (selectedLayoutSegments.includes("my-games") ||
        selectedLayoutSegments.includes("account"))
    ) {
      return children; // We allow guests with a guest token to access the my-games section and the account section to see the game they are currently playing, but not the other sections of the dashboard
    }

    return (
      <>
        <div>
          <header>
            <h1>{routeNames[selectedLayoutSegment] || "Page Inconnue"}</h1>
          </header>
          <main className="main-container">
            <div className="card">
              <h4 className="title">Mode invité</h4>
              <p>
                Pas de panique, {guest && <b>comme vous le savez déjà, </b>}{" "}
                vous pouvez <b>jouer sur nos cibles en tant qu'invité</b> !
                <br />
                Cependant, afin de profiter de nos fonctionnalités telles que la{" "}
                <b>création de parties en tant qu'hôte</b>, la{" "}
                <b>visualisation de vos statistiques</b> et la{" "}
                <b>création de groupes d'amis</b>, veuillez vous connecter.
              </p>
              <div className="footer">
                <button
                  onClick={dialogControls.open}
                  type="button"
                  className="btn btn-sm btn-brand"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </main>
        </div>
        <Dialog width="w-150" dialogControls={dialogControls}>
          <LoginDialog dialogControls={dialogControls} />
        </Dialog>
      </>
    );
  }

  return children;
}
