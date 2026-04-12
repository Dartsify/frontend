import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { removeFriend } from "@/lib/fastapi/players";
import { DialogControls, Friend } from "@/utils/types";

export default function DeleteFriendConfirmationDialog({
  dialogControls,
  friendData,
}: {
  dialogControls: DialogControls;
  friendData: Friend | null;
}) {
  const { username, name } = friendData ?? {};
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const handleRemoveFriend = async () => {
    if (!username) return;

    const res = await removeFriend(username);

    const { data, error } = res;

    if (error) {
      setError(
        typeof error === "string"
          ? error
          : "Une erreur est survenue lors de la suppression de l'ami. Veuillez réessayer.",
      );
      return;
    }

    dialogControls.close();
    router.refresh();
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

      {error && <p className="text-red-500 mt-2">{error}</p>}

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
