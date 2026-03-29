import { Participant, User } from "./types";

export const games = [
  // Keep it first bc it is the default game when creating a new game
  {
    name: "501",
    description:
      "Un jeu de fléchettes où les joueurs commencent avec un score de 501 et doivent réduire ce score à zéro en lançant des fléchettes sur le tableau.",
    slug: "501",
  },
  {
    name: "Custom Dartsify",
    description:
      "Un jeu de fléchettes spécialement conçu par Dartsify pour encore plus de fun !",
    slug: "custom-dartsify",
  },
  {
    name: "301",
    description:
      "Similaire au 501, mais les joueurs commencent avec un score de 301 et doivent réduire ce score à zéro.",
    slug: "301",
  },
];

export const gameNames: string[] = games.map((game) => game.name);

// Return the name of the host of the game
export const gameHostName = (participations: Participant[]) => {
  const host = participations.find((p) => p.is_host == true);

  return host
    ? { name: host.player_name, username: host.player_username }
    : { name: "Inconnu", username: "N/A" };
};

// This function checks if the user is the host of the game, it will be used to show a different warning message when the user tries to leave the page
export const isHost = (
  participations: Participant[],
  userData: User | null,
): boolean => {
  const host = participations.find((p) => p.is_host == true);
  if (!userData) {
    return false;
  }
  return userData?.username === host?.player_username;
};
