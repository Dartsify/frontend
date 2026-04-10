"use client";

import { X } from "lucide-react";
import { SubmitEvent, useEffect, useRef, useState } from "react";

import { sendFriendRequest } from "@/lib/fastapi/players";

import { DialogControls } from "@/utils/types";

export default function AddFriendDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [associatedUsername, setAssociatedUsername] = useState<string | null>(
    null,
  ); // This state is used to prevent multiple requests for the same username after an error

  useEffect(() => {
    if (!dialogControls.isOpen) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [dialogControls.isOpen]);

  const buttonDisabled =
    username.length === 0 || username === associatedUsername;

  // Handle Submit the form to send a friend request to the entered username
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await sendFriendRequest(username);

    const { data, error } = res;

    console.log(data);
    console.log(error);

    if (error) {
      // Handle error (e.g., show a toast notification)
      if (typeof error === "string") {
        setAssociatedUsername(username);
        setError(error);
        return;
      }
      setError("Une erreur est survenue. Veuillez réessayer.");
      return;
    }

    // Optionally, show a success message or update the UI
    dialogControls.close();
  };

  return (
    <div className="dialog">
      <div className="header">
        <h2>Ajouter un ami</h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>

      <p className="text-foreground-soft">
        Entrez le nom d'utilisateur de votre ami pour lui envoyer une demande
        d'amis. Une fois qu'il aura accepté votre demande, vous pourrez
        l'inviter à jouer des parties avec vous !
      </p>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="input-field pre-text">
          <div>
            <input
              ref={inputRef}
              type="text"
              name="username"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Set the value to the state
              required
            />
            <p>@</p>
          </div>
        </div>

        <div className="footer">
          <button
            className="btn btn-destructive-soft"
            type="button"
            onClick={dialogControls.close}
          >
            Annuler
          </button>
          <button
            className={`btn btn-brand ${buttonDisabled ? "btn-invalid" : ""}`}
            type="submit"
            disabled={buttonDisabled}
          >
            Inviter
          </button>
        </div>
      </form>
    </div>
  );
}
