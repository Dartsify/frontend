import { useState } from "react";

import { X } from "lucide-react";

import { DialogControls, Friend } from "@/utils/types";
import { getMyFriends } from "@/lib/fastapi/players";
import Image from "next/image";

export default function AddPlayersToGameDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const [input, setInput] = useState<string>("");
  const [usernames, setUsernames] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Friend[]>([]); // This state will hold the suggestions for the usernames based on the input

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);

    if (value.length === 0) {
      // If the input is empty, we clear the suggestions and the error and we don't make the API call
      setSuggestions([]);
      setError(null);

      return;
    }

    setLoading(true);

    const res = await getMyFriends(value);
    // TODO : as in Todin App, cancel the previous request if there is a new one before the previous one is finished to avoid

    const { error, data } = res;

    if (error || !data) {
      if (typeof error === "string") {
        setError(error);
        return;
      }
      setError(
        "Une erreur est survenue lors de la récupération de vos amis. Veuillez réessayer.",
      );
      return;
    }

    setSuggestions(
      data.filter((friend) => !usernames.includes(friend.username)),
    ); // We filter the suggestions to not show the usernames that are already added
    setLoading(false);
  };

  // Suggestions shown when the user types in the input, we can click on them to add them to the list of usernames to add to the game
  const listItem_suggestions = (friend: Friend, index: number) => {
    const { name, username } = friend;

    return (
      <div
        onClick={() => {
          if (usernames.includes(username)) {
            setError("Ce joueur est déjà ajouté.");
            return;
          }
          setUsernames([...usernames, username]);
          setInput("");
          setSuggestions([]);
        }}
        className="card p-1.5 flex flex-row gap-3 items-center hover-anim-size-soft cursor-pointer"
        key={index}
      >
        <div className="rounded-md relative w-7 h-7 md:w-10 md:h-10 overflow-hidden">
          <Image
            src={`https://avatars.githubusercontent.com/${username}`}
            alt="Avatar"
            objectFit="cover"
            fill
          />
        </div>

        <div>
          <h4 className="leading-none font-medium">{name}</h4>
          <p className="text-sm-2 text-foreground-soft -my-0.5">@{username}</p>
        </div>
      </div>
    );
  };

  // List item for the usernames that are added in the input, we show them as tags in the input
  const listItem_usernames = (username: string, index: number) => {
    return (
      <p
        key={index}
        className="px-2 py-1 bg-brand rounded-lg text-foreground-light"
      >
        {username}
      </p>
    );
  };

  return (
    <div className="dialog">
      <div className="header">
        <h2>Ajouter des joueurs</h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>

      <p className="text-foreground-soft">
        {/* Vous pouvez créer un joueur invité ou ajouter un de vos amis.  */}
        Entrez le nom d'utilisateur d'un ami afin de l'ajouter à la partie ou
        entrez un nom de joueur pour créer un joueur invité.
      </p>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <form className="mt-5">
        {/* <div className="flex items-center gap-2"> */}
        <div className="input flex items-center gap-2">
          {usernames.map((username, index) =>
            listItem_usernames(username, index),
          )}{" "}
          {/* Map the usernames to display them in the input as tags */}
          <input
            type="text"
            placeholder="Nom d'utilisateur ou nom d'invité"
            className="outline-none border-none p-0 pl-0.5" // Remove the default input styles, we already have them in the parent div with the "input" class
            value={input}
            onChange={onInputChange}
          />
        </div>

        {input.length > 0 && (
          <>
            {loading ? (
              <p>loading...</p>
            ) : suggestions.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {suggestions.map((friend, index) =>
                  listItem_suggestions(friend, index),
                )}
              </div>
            ) : (
              <p className="">Aucune suggestion disponible.</p>
            )}
          </>
        )}

        <div className="footer">
          <button
            type="button"
            className={`btn btn-destructive`}
            onClick={dialogControls.close}
          >
            Annuler
          </button>
          <button
            type="submit"
            className={`btn btn-brand ${usernames.length === 0 && "btn-invalid"}`}
            disabled={usernames.length === 0}
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
}
