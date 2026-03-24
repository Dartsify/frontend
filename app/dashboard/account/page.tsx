"use client";

import { useContext } from "react";

import { UserDataContext } from "../providers";

import Dialog from "@/components/dialogs/dialog";
import LoginDialog from "@/components/dialogs/loginDialog";

import { useDialog } from "@/lib/hooks/useDialog";
import { logout } from "@/lib/fastapi/auth";

export default function Account() {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const dialogControls = useDialog();

  return (
    <>
      <div>
        <h1>Mon Compte</h1>

        {userData ? (
          <>
            <p>Bienvenue, {userData.username} !</p>
            <p>Email: {userData.email}</p>
            <p>Nom complet: {userData.name}</p>
          </>
        ) : (
          <p>Vous n'êtes pas connecté.</p>
        )}

        {userData ? (
          <button
            type="button"
            className="btn btn-destructive mt-10"
            onClick={() => logout()}
          >
            Se déconnecter
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-brand mt-10"
            onClick={() => dialogControls.open()}
          >
            Se connecter
          </button>
        )}
      </div>
      <Dialog width="w-150" dialogControls={dialogControls}>
        <LoginDialog dialogControls={dialogControls} />
      </Dialog>
    </>
  );
}
