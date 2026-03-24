"use client";

import { DialogControls } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserDataContext } from "@/app/dashboard/providers";
import { X } from "lucide-react";

import LoginDialog from "./loginDialog";

export default function NeedToLoginDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const router = useRouter();

  const userDataContext = useContext(UserDataContext);

  if (!userDataContext) return <div>Loading...</div>;

  const { userData } = userDataContext;

  const [showLogin, setShowLogin] = useState<boolean>(false);

  if (showLogin) {
    return (
      <LoginDialog
        dialogControls={{ ...dialogControls, back: () => setShowLogin(false) }}
      />
    );
  }

  return (
    <div className="dialog">
      <div className="header">
        <h2>Vous devez être connecté pour continuer</h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>
      <p className="text-foreground-soft">
        Pour être l'administrateur de la partie et la contrôler, vous devez être
        connecté à votre compte ou vous en créez un.
        <br />
        Sinon, vous pouvez revenir en arrière et attendre qu'un utilisateur
        connecté se connecte en premier à la cible pour rejoindre sa partie en
        tant que joueur.
      </p>

      <div className="footer">
        <button
          className={`btn btn-destructive-soft`}
          type="submit"
          onClick={dialogControls.close}
        >
          Retour
        </button>
        <button
          className={`btn btn-brand`}
          type="submit"
          onClick={() => setShowLogin(true)}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
