import { addGuests, addPlayers } from "@/lib/fastapi/games";
import { DashboardNotification, Participant, User } from "./types";
import PlayerName from "@/components/playerName";
import Image from "next/image";
import { calendarConvert, utcConvert } from "./dates";

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

// Constantes de calibration (Camera 1 par défaut, d'après les valeurs du backend OpenCV)
const CAMERA_CALIBRATION = {
  CENTER_X: 642,
  CENTER_Y: 356,
  R_BULL_INNER: 8,
  R_BULL_OUTER: 24,
  R_TRIPLE_INNER: 139,
  R_TRIPLE_OUTER: 155,
  R_DOUBLE_INNER: 235,
  R_DOUBLE_OUTER: 251,
};

// Dimensions physiques réelles en millimètres (comme dans Dartboard.tsx)
export const REAL_BOARD = {
  bullInnerRadius: 6.35,
  bullOuterRadius: 15.9,
  tripleInnerRadius: 99,
  tripleOuterRadius: 107,
  doubleInnerRadius: 162,
  doubleOuterRadius: 170,
};

// Mappe les pixels ultra-précis de l'image caméra vers les proportions exactes en millimètres de la cible SVG
export function mapBackendToDartboard(
  bx: number,
  by: number,
): { x: number; y: number } {
  // L'axe y de OpenCV descend, donc Y = CENTER_Y - by pour l'inverser classiquement
  const dx = bx - CAMERA_CALIBRATION.CENTER_X;
  const dy = CAMERA_CALIBRATION.CENTER_Y - by;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);

  let mappedDistance = 0;

  if (distance === 0) {
    mappedDistance = 0;
  } else if (distance <= CAMERA_CALIBRATION.R_BULL_INNER) {
    mappedDistance =
      (distance / CAMERA_CALIBRATION.R_BULL_INNER) * REAL_BOARD.bullInnerRadius;
  } else if (distance <= CAMERA_CALIBRATION.R_BULL_OUTER) {
    mappedDistance =
      REAL_BOARD.bullInnerRadius +
      ((distance - CAMERA_CALIBRATION.R_BULL_INNER) /
        (CAMERA_CALIBRATION.R_BULL_OUTER - CAMERA_CALIBRATION.R_BULL_INNER)) *
        (REAL_BOARD.bullOuterRadius - REAL_BOARD.bullInnerRadius);
  } else if (distance <= CAMERA_CALIBRATION.R_TRIPLE_INNER) {
    mappedDistance =
      REAL_BOARD.bullOuterRadius +
      ((distance - CAMERA_CALIBRATION.R_BULL_OUTER) /
        (CAMERA_CALIBRATION.R_TRIPLE_INNER - CAMERA_CALIBRATION.R_BULL_OUTER)) *
        (REAL_BOARD.tripleInnerRadius - REAL_BOARD.bullOuterRadius);
  } else if (distance <= CAMERA_CALIBRATION.R_TRIPLE_OUTER) {
    mappedDistance =
      REAL_BOARD.tripleInnerRadius +
      ((distance - CAMERA_CALIBRATION.R_TRIPLE_INNER) /
        (CAMERA_CALIBRATION.R_TRIPLE_OUTER -
          CAMERA_CALIBRATION.R_TRIPLE_INNER)) *
        (REAL_BOARD.tripleOuterRadius - REAL_BOARD.tripleInnerRadius);
  } else if (distance <= CAMERA_CALIBRATION.R_DOUBLE_INNER) {
    mappedDistance =
      REAL_BOARD.tripleOuterRadius +
      ((distance - CAMERA_CALIBRATION.R_TRIPLE_OUTER) /
        (CAMERA_CALIBRATION.R_DOUBLE_INNER -
          CAMERA_CALIBRATION.R_TRIPLE_OUTER)) *
        (REAL_BOARD.doubleInnerRadius - REAL_BOARD.tripleOuterRadius);
  } else if (distance <= CAMERA_CALIBRATION.R_DOUBLE_OUTER) {
    mappedDistance =
      REAL_BOARD.doubleInnerRadius +
      ((distance - CAMERA_CALIBRATION.R_DOUBLE_INNER) /
        (CAMERA_CALIBRATION.R_DOUBLE_OUTER -
          CAMERA_CALIBRATION.R_DOUBLE_INNER)) *
        (REAL_BOARD.doubleOuterRadius - REAL_BOARD.doubleInnerRadius);
  } else {
    mappedDistance =
      REAL_BOARD.doubleOuterRadius +
      (distance - CAMERA_CALIBRATION.R_DOUBLE_OUTER) *
        (REAL_BOARD.doubleOuterRadius / CAMERA_CALIBRATION.R_DOUBLE_OUTER);
  }

  return {
    x: Math.cos(angle) * mappedDistance,
    y: Math.sin(angle) * mappedDistance,
  };
}

export const addAllPlayersToGame = async (
  gameId: number,
  players: { username: string; guest: boolean }[],
) => {
  const guests = players.filter((p) => p.guest).map((p) => p.username);
  const nonGuests = players.filter((p) => !p.guest).map((p) => p.username);

  const nonGuestsRes = await addPlayers(gameId, nonGuests);
  const guestsRes = await addGuests(gameId, guests);

  const { error: nonGuestsError, data: nonGuestsData } = nonGuestsRes;
  const { error: guestsError, data: guestsData } = guestsRes;

  if (nonGuestsError) {
    console.error("Error adding non-guest players:", nonGuestsError);
    return { error: nonGuestsError };
  }

  if (guestsError) {
    console.error("Error adding guest players:", guestsError);
    return { error: guestsError };
  }

  return { data: { nonGuests: nonGuestsData, guests: guestsData } };
};

// Return a good text (in French) and a color for status
export const statusBadge = (status: string) => {
  switch (status) {
    case "waiting":
      return { text: "Préparation", color: "bg-highlight" };
    case "in_progress":
      return { text: "En cours", color: "bg-green-500" };
    case "finished": {
      return { text: "Terminé", color: "bg-brand" };
    }
    default:
      return { text: "Inconnu", color: "bg-gray-500" };
  }
};

export const notificationType = (notification: DashboardNotification) => {
  switch (notification.type) {
    case "pending-game": {
      const {
        player_username,
        player_name,
        join_date,
        game_mode,
        target_location,
        target_name,
      } = notification;
      return {
        title: "Nouvelle partie en attente",
        // description: `Alexandre (alexboss) a créé une nouvelle partie de Cricket dans le groupe Test à Chez Cabu.`,
        description: `${player_name} (${player_username}) a créé une nouvelle partie de ${game_mode} à ${target_location}.`,
        subtitle:
          "Confirmez votre présence afin d'ajouter cette partie à vos statistiques !",
        date: join_date,
        content: () => null,
      };
    }
    case "friend-request": {
      const { username, name, request_date } = notification;
      return {
        title: "Nouvelle demande d'ami",
        // description: `Alexandre (alexboss) a créé une nouvelle partie de Cricket dans le groupe Test à Chez Cabu.`,
        description: `${name} (${username}) vous a envoyé une demande d'ami.`,
        subtitle:
          "Acceptez l'invitation pour ajouter ce joueur à votre liste d'amis. Les amis vous permettent de suivre leurs statistiques et de les inviter rapidement à des parties !",
        date: request_date,
        content: () => {
          return (
            <p>
              <b>
                {name} (@{username})
              </b>{" "}
              vous a envoyé une demande d'ami{" "}
              <b>{calendarConvert(request_date).toLowerCase()}</b>.
            </p>
          );
        },
      };
    }
    // case "group-invite": {
    //   return {
    //     title: "Nouvelle invitation à rejoindre un groupe",
    //     description: `Adrien (adri1) vous a invité à rejoindre le groupe Les Pros de Fléchettes.`,
    //     subtitle:
    //       "Acceptez l'invitation pour rejoindre le groupe de joueurs. Les groupes de joueurs permettent de démarrer rapidement une partie avec vos amis !",
    //     date: new Date(),
    //   }
    // }
    default:
      return {
        title: "Notification",
        description: "Vous avez une nouvelle notification.",
        date: new Date(),
        content: () => null,
      };
  }
};
