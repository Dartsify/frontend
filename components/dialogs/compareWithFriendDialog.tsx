"use client";

import { X } from "lucide-react";
import { SubmitEvent, useEffect, useRef, useState } from "react";

import { DialogControls, Friend } from "@/utils/types";
import { getMyFriends } from "@/lib/fastapi/players";
import Image from "next/image";

export default function CompareWithFriendDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [friends, setFriends] = useState<Friend[]>([]);

  //   Get friends data on render
  useEffect(() => {
    const getData = async () => {
      const res = await getMyFriends();

      const { data, error } = res;

      if (error || !data) {
        if (typeof error === "string") {
          setError(error);
        } else {
          setError("Erreur inconnue");
        }
      } else {
        setFriends(data);
      }
    };

    getData();
  }, []);

  // Reset the state on closing the dialog
  useEffect(() => {
    if (!dialogControls.isOpen) {
      setTimeout(() => {
        setUsername("");
        setError(null);
      }, 300); // We wait to let the closing animation of the dialog play before resetting the state to avoid seeing the reset state during the closing animation
    }
  }, [dialogControls.isOpen]);

  // Handle Submit the form to send a friend request to the entered username
  const handleSelectFriend = async (username: string) => {
    if (dialogControls.enter) {
      dialogControls.enter({ username });
    }

    dialogControls.close();
  };

  const data =
    username.length > 0
      ? friends.filter(
          (f) =>
            f.username.includes(username.toLowerCase()) ||
            f.name.toLowerCase().includes(username.toLowerCase()),
        )
      : friends;

  const listItem = (friend: Friend, index: number) => {
    const { name, username } = friend;

    return (
      <li
        onClick={() => handleSelectFriend(username)}
        className="card bg-background-dark p-2 flex flex-row gap-3 items-center hover-anim-size-soft cursor-pointer"
        key={index}
      >
        <div className="rounded-xl relative w-8 h-8 md:w-12 md:h-12 overflow-hidden">
          <Image
            src={`https://avatars.githubusercontent.com/${username}`}
            alt="Avatar"
            objectFit="cover"
            fill
          />
        </div>

        <div>
          <h4 className="leading-none font-medium">{name}</h4>
          <p className="text-sm-2 text-foreground-soft -my-1">@{username}</p>
        </div>
      </li>
    );
  };

  return (
    <div className="dialog">
      <div className="header">
        <h2>Sélectionnez un ami</h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>

      <p className="text-foreground-soft">
        Choisissez un ami pour comparer vos statistiques et vos performances
        dans les différentes parties de fléchettes. Vous pourrez ainsi voir qui
        est le meilleur entre vous deux !
      </p>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <form className="mt-5">
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

        <div>
          {data.length === 0 ? (
            <p>
              <i>Aucun ami trouvé avec ce nom d'utilisateur.</i>
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4">
              {data.map((f, index) => listItem(f, index))}
            </ul>
          )}
        </div>

        <div className="footer">
          <button
            className="btn btn-destructive"
            type="button"
            onClick={dialogControls.close}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
