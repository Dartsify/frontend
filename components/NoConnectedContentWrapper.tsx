"use client";

import { useDialog } from "@/lib/hooks/useDialog";
import Dialog from "./dialogs/dialog";
import LoginDialog from "./dialogs/loginDialog";
import { useContext } from "react";
import { UserDataContext } from "@/app/dashboard/providers";
import {
  useRouter,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import PlayGameSection from "./sections/playGameSection";
import { routeNames } from "@/utils/routes";

export default function NoConnectedContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const router = useRouter();
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const selectedLayoutSegments = useSelectedLayoutSegments();

  const dialogControls = useDialog();

  if (!userData && !selectedLayoutSegments.includes("new-game")) {
    if (!selectedLayoutSegment) {
      // Specific NoConnectedContent for home page of the dashboard
      return (
        <>
          <div>
            <header>
              <h1>Bonjour 👋</h1>
            </header>
            <main className="main-container">
              <div className="card">
                <h4 className="title">Mode invité</h4>
                <p>
                  Pas de panique, vous pouvez{" "}
                  <b>jouer sur nos cibles en tant qu'invité</b> !
                  <br />
                  Cependant, afin de profiter de nos fonctionnalités telles que
                  la <b>visualisation de vos statistiques</b> et la{" "}
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
                Pas de panique, vous pouvez{" "}
                <b>jouer sur nos cibles en tant qu'invité</b> !
                <br />
                Cependant, afin de profiter de nos fonctionnalités telles que la{" "}
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
