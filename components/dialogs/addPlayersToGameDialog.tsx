import React, { SubmitEvent, use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";

import { useDebounce } from "use-debounce";

import { DialogControls, Friend, Participant } from "@/utils/types";

import { getMyFriends } from "@/lib/fastapi/players";
import { addAllPlayersToGame } from "@/utils/games";

// TODO : baser le nombre incrémenté après le nom d'un guest sur base de la liste de players déjà ajoutés pour éviter les doublons dans le cas où on ajoute plusieurs guests avec le même nom, actuellement on ajoute (1) au premier guest et (2) au deuxième guest mais si on ajoute un troisième guest avec le même nom, il sera ajouté sans numéro incrémenté alors que ça devrait être (3)

export default function AddPlayersToGameDialog({
  dialogControls,
  participations,
  gameId,
  participants = [],
}: {
  dialogControls: DialogControls;
  participations: Participant[] | undefined;
  gameId: number;
  participants?: Participant[];
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [input, setInput] = useState<string>("");
  // const [usernames, setUsernames] = useState<string[]>([]);
  const [players, setPlayers] = useState<
    { username: string; guest: boolean }[]
  >([]);
  const [alreadyAddedPlayers, setAlreadyAddedPlayers] = useState<
    { username: string; guest: boolean }[]
  >([]); // We need to have the participants in a state in order to update it when we add players to the game, we initialize it with the participations that are passed as props

  // Initialize the debouncedInput value with the input value
  const [debouncedInput] = useDebounce(input, 300);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Friend[]>([]); // This state will hold the suggestions for the usernames based on the input

  // Function to get the editable player name when we want to edit a player by pressing backspace on an empty input, if the player is a guest we return only the username without the incremented number at the end, if it's not a guest we return the username as it is
  const getEditablePlayerName = (player: {
    username: string;
    guest: boolean;
  }) => {
    if (!player.guest) {
      return player.username;
    }

    return player.username.replace(/\s\(\d+\)$/, "");
  };

  // Focus the input when the dialog is opened
  useEffect(() => {
    if (!dialogControls.isOpen) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [dialogControls.isOpen]);

  useEffect(() => {
    if (dialogControls.isOpen) {
      setAlreadyAddedPlayers(
        participants.map((p, i) => ({
          username: p.player_username,
          guest: p.player_username.startsWith("Guest_"),
        })),
      ); // We update the alreadyAddedPlayers state to match the players data
    } else {
      // When dialog is closed, we reset the input, the players to add, the suggestions and the error
      setTimeout(() => {
        setSuggestions([]);
        setPlayers([]);
        setInput("");
        setError(null);
      }, 300); // We put a timeout to wait for the closing animation of the dialog to finish before resetting the states
    }
  }, [dialogControls.isOpen]);

  // useEffect in order to make the API call to get the friends suggestions based on the debounced input value
  useEffect(() => {
    setLoading(true);

    const fetchSuggestions = async () => {
      // We make the search only if the input is not empty (a space triggers the search but we don't want to make the API call if the input is empty or only contains spaces)
      if (debouncedInput.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      const res = await getMyFriends(debouncedInput.trim());

      const { error, data } = res;

      if (error || !data) {
        setError(
          typeof error === "string"
            ? error
            : "Une erreur est survenue lors de la récupération de vos amis. Veuillez réessayer.",
        );
        return;
      }

      //  Filter the suggestions
      const filteredSuggestions = data.filter(
        (friend) =>
          !players.some((p) => !p.guest && p.username === friend.username) && // ce player non invité n’est pas déjà ajouté dans la liste des joueurs à ajouter
          !participations?.some((p) => p.player_username === friend.username), // ce player n’apparaît dans aucune participation
      );

      setSuggestions(filteredSuggestions); // We filter the suggestions to not show the usernames that are already added

      setLoading(false);
    };

    fetchSuggestions();
  }, [debouncedInput, players, participations]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && input.length === 0) {
      // When user press backspace and the input is empty, we edit the last player we added to the list of players
      const lastPlayer = players[players.length - 1];
      if (!lastPlayer) return;

      setTimeout(() => {
        setPlayers((prev) => prev.slice(0, prev.length - 1)); // We remove the last player from the list of players to add
        setInput(getEditablePlayerName(lastPlayer)); // Only write (lastPlayer.username) makes trouble (we are not able to edit the name)
      }, 25); // Set a timeout in order to disable the backspace effect on the username
    }
  };

  // On change of the input, we update the input state
  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInput(value);

    if (value.length === 0) {
      // If the input is empty, we clear the suggestions and the error and we don't make the API call
      setSuggestions([]);
      setError(null);

      return;
    }

    if (value[value.length - 1] === " ") {
      addPlayerToList(value);
    }
  };

  // Add the player to the list of players to add to the game
  const addPlayerToList = (value: string) => {
    // If the last character is a space, it means that the user finished typing a username, so we add it to the list of players to add to the game and we clear the input and the suggestions

    // Check if the username perfectly matches a friend in the suggestions, if yes we add it as a non-guest player, if not we add it as a guest player
    const friendMatch = suggestions.find(
      (friend) => friend.username === value.trim(),
    );

    if (friendMatch) {
      // The username is a friend
      setPlayers((prev) => [
        ...prev,
        { username: friendMatch.username, guest: false },
      ]); // We take the username from the suggestions to be sure that we have the correct username (case sensitive) and we set guest to false
    } else {
      // If we add the user as a non guest, we need to ckeck if the username is already in the list of players to add to avoid duplicates
      let usernameToAdd = value.trim()[0].toUpperCase() + value.trim().slice(1); // We capitalize the first letter of the username to differentiate the guests from the non guests in the UI

      if (players.some((p) => p.guest && p.username === usernameToAdd)) {
        // A player has been already added with the same username as a guest (but without incremented number),
        // so we add (1) to the already added player username and we add the new player with the same username but with (2) at the end to differentiate them in the UI
        const matchingGuest = players.find(
          (p) => p.guest && p.username === usernameToAdd,
        );
        setPlayers((prev) => [
          ...prev.filter((p) => p !== matchingGuest),
          { username: matchingGuest!.username + " (1)", guest: true },
        ]);
        usernameToAdd = usernameToAdd + " (2)"; // We add (1) at the end of the username to differentiate it from the other guest with the same username, we can later add a counter if there are more than 2 guests with the same username
      } else if (
        [...players, ...alreadyAddedPlayers].some(
          (p) =>
            p.guest &&
            p.username.startsWith(usernameToAdd + " (") &&
            p.username.endsWith(")"),
        )
      ) {
        const matchingGuests = [...players, ...alreadyAddedPlayers].filter(
          (p) =>
            p.guest &&
            p.username.startsWith(usernameToAdd + " (") &&
            p.username.endsWith(")"),
        );
        usernameToAdd = usernameToAdd + ` (${matchingGuests.length + 1})`; // We add (x) at the end of the username to differentiate it from the other guests with the same username, x is the number of guests with the same username + 1
      } // Also check if a guest with an incremented number is already in the list to increment the number
      setPlayers((prev) => [...prev, { username: usernameToAdd, guest: true }]); // We set guest to true
    }

    setInput("");
    setSuggestions([]);
  };

  const handleEditAddedPlayer = (index: number) => {
    const player = players[index];
    const { username } = player;

    setInput(username); // Set the input to the username of the player we want to edit, the user can then edit the username and add it again by pressing space or by clicking on the add button, if he doesn't edit it and just press space or click on the add button, it will be added again to the list of players to add to the game
    setPlayers((prev) => prev.filter((_, i) => i !== index)); // We remove the player from the list of players to add to the game, we will re add it with another username if the user edit the username or with the same username if the user doesn't edit it
    inputRef.current?.focus();
  };

  // Handle submit the form (= add all the selected players to the game)
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await addAllPlayersToGame(gameId, players);

    const { data, error } = res;

    if (error) {
      setError(
        typeof error === "string"
          ? error
          : "Une erreur est survenue lors de l'ajout des joueurs à la partie. Veuillez réessayer.",
      );
      return;
    }

    dialogControls.close();
  };

  // Suggestions shown when the user types in the input, we can click on them to add them to the list of usernames to add to the game
  const listItem_suggestions = (friend: Friend, index: number) => {
    const { name, username } = friend;

    return (
      <div
        onClick={() => {
          // On click on a suggestion, we add the player to the list of players to add to the game and we clear the input and the suggestions
          if (players.some((p) => !p.guest && p.username === username)) {
            setError("Ce joueur est déjà ajouté.");
            return;
          }
          setPlayers([...players, { username, guest: false }]); // Add the player as a non-guest player
          setInput(""); // Clear the input
          inputRef.current?.focus(); // Re focus the input
          setSuggestions([]); // Clear suggestions after adding a player from the suggestions list
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
  const listItem_players = (
    player: { username: string; guest: boolean },
    index: number,
  ) => {
    const { username, guest } = player;

    return (
      <p
        key={index}
        className={`badge badge-sm ${guest ? "badge-neutral" : "badge-brand"} leading-3.5 py-1.25 whitespace-normal shrink-0`}
        onClick={() => handleEditAddedPlayer(index)} // Edit the player if we click on it
      >
        {/* {guest ? `${username} (Invité)` : "@" + username} */}
        {guest ? username : "@" + username}
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

      <form className="mt-5" onSubmit={handleSubmit}>
        {/* <div className="flex items-center gap-2"> */}
        <div className="input pr-10 flex flex-wrap items-center gap-2 py-2 relative">
          {/* Map the usernames to display them in the input as tags */}
          {players.map((player, index) => listItem_players(player, index))}
          {/* Input for the new player to add */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Nom d'utilisateur ou nom d'invité"
            className="outline-none border-none p-0 pl-0.5 flex-1 min-w-58" // Remove the default input styles, we already have them in the parent div with the "input" class
            value={input}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
          />
          <div
            className={`btn btn-xs btn-brand-anim absolute bottom-2 right-2.5 ${input.trim().length === 0 && "btn-invalid"}`}
            onClick={() => {
              addPlayerToList(input);
              inputRef.current?.focus();
            }}
          >
            {/* <PlusCircle size={16} /> */}
            <Plus size={16} />
          </div>
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
            className={`btn btn-brand ${players.length === 0 && "btn-invalid"}`}
            disabled={players.length === 0}
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
}
