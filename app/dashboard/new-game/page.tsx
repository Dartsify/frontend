"use client";

import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../providers";
import { useDialog } from "@/lib/hooks/useDialog";
import Dialog from "@/components/dialogs/dialog";
import LoginDialog from "@/components/dialogs/loginDialog";
import TargetDialog from "@/components/dialogs/targetDialog";
import { useRouter } from "next/navigation";

export default function NewGame() {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const router = useRouter();

  const [targetId, setTargetId] = useState<number | null>(null);

  const [mounted, setMounted] = useState<boolean>(false);

  const dialogControls_target = useDialog();
  const dialogControls_login = useDialog();

  useEffect(() => {
    if (targetId == null) {
      dialogControls_target.open();
      setMounted(true);
    }
  }, [targetId]);

  useEffect(() => {
    if (!dialogControls_target.isOpen && targetId == null && mounted) {
      router.push("/dashboard");
    }
  }, [dialogControls_target.isOpen, mounted]);

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

      <Dialog width="w-150" dialogControls={dialogControls_target}>
        <TargetDialog dialogControls={dialogControls_target} />
      </Dialog>

      <Dialog width="w-150" dialogControls={dialogControls_login}>
        <LoginDialog dialogControls={dialogControls_login} />
      </Dialog>
    </>
  );
}
