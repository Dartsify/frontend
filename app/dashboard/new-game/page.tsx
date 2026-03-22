"use client";

import { SubmitEvent, useContext, useEffect, useState } from "react";
import { UserDataContext } from "../providers";
import { useDialog } from "@/lib/hooks/useDialog";
import Dialog from "@/components/dialogs/dialog";
import LoginDialog from "@/components/dialogs/loginDialog";

export default function NewGame() {
  const userDataContext = useContext(UserDataContext);

  if (!userDataContext) return <div>Loading...</div>;

  const { userData } = userDataContext;

  const [targetId, setTargetId] = useState<number | null>(null);

  const dialogControls = useDialog();

  useEffect(() => {
    if (targetId == null) {
    }
  }, [targetId]);

  return (
    <>
      <div>
        <h1>Nouvelle partie</h1>

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
                    onClick={dialogControls.open}
                    type="button"
                    className="btn btn-sm btn-dark"
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
                    <b>Mode de jeu :</b> 501
                  </li>
                </ul>
              </div>
              <div className="card">
                <h4 className="title">Cible</h4>
                <ul>
                  <li>
                    <b>Identifiant :</b> XXX-XXX
                  </li>
                  <li>
                    <b>Description :</b> Lorem ipsum dolor, sit amet consectetur
                    adipisicing elit.
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section className="default-section">
            <div className="card">
              <h4 className="title">Joueurs</h4>
              <ul>
                <li>Mathias Bartolas</li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      <Dialog width="w-150" dialogControls={dialogControls}>
        <LoginDialog dialogControls={dialogControls} />
      </Dialog>
    </>
  );
}
