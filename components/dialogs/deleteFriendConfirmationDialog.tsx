import { DialogControls, Friend } from "@/utils/types";
import { X } from "lucide-react";

export default function DeleteFriendConfirmationDialog({
  dialogControls,
  friendData,
}: {
  dialogControls: DialogControls;
  friendData: Friend | null;
}) {
  const { username, name } = friendData ?? {};

  const handleRemoveFriend = () => {
    alert("Soon : Friend removed"); // TODO: replace with actual remove friend logic
    dialogControls.close();
  };

  return (
    <div className="dialog">
      <div className="header">
        <h2>
          Supprimer {name} (@{username}) de votre liste d'amis ?
        </h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>

      <p className="text-foreground-soft">
        Êtes-vous sûr de vouloir supprimer {name} de votre liste d'amis ? Cette
        action est irréversible.
      </p>

      <div className="footer">
        {dialogControls.back ? (
          <button className="btn" type="button" onClick={dialogControls.back}>
            Retour
          </button>
        ) : (
          <button className="btn" type="button" onClick={dialogControls.close}>
            Annuler
          </button>
        )}
        <button
          className="btn btn-destructive"
          type="button"
          onClick={handleRemoveFriend}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
