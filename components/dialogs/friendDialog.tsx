"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

import { DialogControls, Friend } from "@/utils/types";
import { utcConvert } from "@/utils/dates";

import DeleteFriendConfirmationDialog from "./deleteFriendConfirmationDialog";

export default function FriendDialog({
  dialogControls,
  friendData,
}: {
  dialogControls: DialogControls;
  friendData: Friend | null;
}) {
  const [showRemovePlayerConfirmation, setShowRemovePlayerConfirmation] =
    useState(false);

  const { username, name, age, creation_date } = friendData ?? {};

  // When the dialog is closed, we want to reset the showRemovePlayerConfirmation state to false to show the friend dialog again when we open the dialog next time (when we click on another friend for example)
  useEffect(() => {
    if (!dialogControls.isOpen) {
      setTimeout(() => {
        setShowRemovePlayerConfirmation(false);
      }, 300); // We wait for 300ms to let the closing animation of the dialog play before resetting the state
    }
  }, [dialogControls.isOpen]);

  if (showRemovePlayerConfirmation) {
    return (
      <DeleteFriendConfirmationDialog
        friendData={friendData}
        dialogControls={{
          ...dialogControls,
          back: () => setShowRemovePlayerConfirmation(false), // On back we want to show the friend dialog again
        }}
      />
    );
  }

  return (
    <div className="dialog">
      <div className="header">
        <h2>
          {name} (@{username})
        </h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>
      <p className="text-foreground-soft">
        Vous êtes amis depuis 3 mois (DATE ARBITRAIRE).
        {/* Vous avez joué 20 parties ensemble et
        votre taux de victoire contre lui est de 60%. */}
      </p>
      <p className="mt-4 leading-6">
        <b>Âge : </b> {age || "Inconnu"}
        {creation_date && (
          <>
            <br />
            <b>Date de création de compte : </b>{" "}
            {utcConvert(creation_date).format("DD/MM/YYYY") || "Inconnue"}
          </>
        )}
        <br />
        <b>Nombre de parties jouées : </b> 20
        <br />
        <b>Taux de victoire : </b> 22%
      </p>

      <Link
        href={`/dashboard/my-games/player=${username}`} // TODO : replace with actual link to the game page with this friend to show all the games played together
        className="brand-link mt-2"
      >
        Voir toutes les parties jouées ensemble
      </Link>
      {friendData && (
        <div className="footer">
          <button
            className="btn btn-destructive-soft"
            type="button"
            onClick={() => setShowRemovePlayerConfirmation(true)}
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
