"use client";

import { useContext } from "react";

import { UserDataContext } from "../providers";

import Dialog from "@/components/dialogs/dialog";
import LoginDialog from "@/components/dialogs/loginDialog";

import { useDialog } from "@/lib/hooks/useDialog";
import { logout } from "@/lib/fastapi/auth";
import { utcConvert } from "@/utils/dates";

export default function Account() {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const { username, email, name, guest, age, creation_date } = userData ?? {};

  const dialogControls = useDialog();

  return (
    <>
      <div>
        <h1>Mon Compte</h1>
        {/* If the user is not logged in, a default card is already shown (from the layout) */}

        {/* If the user is a guest */}
        {guest && (
          <div className="card card-sm">
            <h4>Mode invité</h4>
            <p>
              Vous êtes connecté en tant qu'invité avec le nom{" "}
              <b>
                {name} (@{username})
              </b>
              .
            </p>
            <p>
              Vous pouvez <b>rejoindre des parties en cours</b>, mais vous{" "}
              <b>ne pourrez pas créer de partie</b> ni accéder à certaines
              fonctionnalités réservées aux utilisateurs connectés.
              <br />
              <b>
                Votre progression ne sera pas sauvegardée, alors profitez-en
                pour tester le jeu et n'hésitez pas à créer un compte pour
                profiter pleinement de Dartsify !
              </b>
            </p>
            <div className="footer">
              <button
                type="button"
                className="btn btn-brand btn-sm"
                onClick={() => dialogControls.open()}
              >
                Se connecter
              </button>
            </div>
          </div>
        )}

        {/* If the user is logged in and not a guest */}
        {!guest && (
          <div className="card">
            <h3>
              Bienvenue, {name} (@{username}) !
            </h3>
            {creation_date && (
              <p className="subtitle">
                Vous avez rejoint Dartsify le{" "}
                {utcConvert(creation_date).format("DD/MM/YYYY")}
              </p>
            )}
            <div className="content">
              <p>
                <b>Email :</b> {email}
              </p>
              <p>
                <b>Nom complet :</b> {name}
              </p>
              <p>
                <b>Âge :</b> {age || "Non renseigné"}
              </p>
            </div>

            <div className="footer">
              <button
                type="button"
                className="btn btn-sm btn-destructive"
                onClick={() => logout()}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
      <Dialog width="w-5/6 max-w-150" dialogControls={dialogControls}>
        <LoginDialog dialogControls={dialogControls} />
      </Dialog>
    </>
  );
}
