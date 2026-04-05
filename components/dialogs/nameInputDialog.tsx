"use client";

import { X } from "lucide-react";

import { DialogControls } from "@/utils/types";

export default function NameInputDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username")?.toString().trim();
    if (username) {
      // Execute enter function passed in dialogControls (which will join the game with the provided username) and close the dialog.
      dialogControls.enter && dialogControls.enter({ username });
      dialogControls.close();
    }
  };

  return (
    <div className="dialog">
      <div className="header">
        <h2>Choisissez votre nom pour rejoindre la partie</h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>

      <p className="text-foreground-soft">
        Ce nom sera visible par les autres joueurs de la partie, alors
        choisissez-le avec soin !
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <input type="text" name="username" placeholder="Entrez votre nom" />

        <div className="footer">
          <button
            className={`btn btn-destructive-soft`}
            type="button"
            onClick={dialogControls.close}
          >
            Retour
          </button>
          <button className={`btn btn-brand`} type="submit">
            Rejoindre
          </button>
        </div>
      </form>
    </div>
  );
}
