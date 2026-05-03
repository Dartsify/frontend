"use server";

import { getToken, saveToken } from "@/lib/fastapi/auth";
import { buildApiUrl } from "@/utils/requests";
import {
  Game,
  GameDetail,
  GameMode,
  GameStatus,
  JoinGameResponse,
} from "@/utils/types";

export const createGame = async (target_id: string, mode: GameMode) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  console.log("mode : " + mode);

  try {
    const res = await fetch(buildApiUrl("/games/"), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ target_id, mode }),
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error: data.detail || "Failed to create game. Please try again.",
      };
    }

    console.log(data);

    return { data: data as Game };
  } catch (error) {
    console.error("Error during creating a game :", error);
    return { error: "Erreur réseau" };
  }
};

export const addPlayers = async (game_id: number, usernames: string[]) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/add_players`), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ usernames }),
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error:
          data.detail || "Failed to add players to the game. Please try again.",
      };
    }

    console.log("Players added to game successfully:", data);

    return { data };
  } catch (error) {
    console.error("Error during adding players to game:", error);
    return { error: "Erreur réseau" };
  }
};

export const addGuests = async (game_id: number, guest_names: string[]) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/add_guests`), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ guest_names }),
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error:
          data.detail || "Failed to add guests to the game. Please try again.",
      };
    }

    console.log("Guests added to game successfully:", data);

    return { data };
  } catch (error) {
    console.error("Error during adding guests to game:", error);
    return { error: "Erreur réseau" };
  }
};

export const getGames = async ({
  status,
  limit = 50,
  offset,
}: {
  status?: GameStatus[];
  limit?: number;
  offset?: number;
}) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(
      // If a status is provided, we add it as a query parameter to filter games by status, otherwise we get all games
      buildApiUrl(
        `/games/?limit=${limit}${status ? `&status=${status.join("&status=")}` : ""}${offset ? `&offset=${offset}` : ""}`,
      ),
      {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      },
    );

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    console.log(data);

    if (!res.ok) {
      return {
        error: data.detail || "Failed to fetch games. Please try again.",
      };
    }

    return { data: data as Game[] };
  } catch (error) {
    console.error("Error during fetching games:", error);
    return { error: "Erreur réseau" };
  }
};

export const getGame = async (game_id: number) => {
  const token = await getToken();

  // if (!token) {
  //   return { error: "No auth token found" };
  // }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}`), {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await res.json();
      data.id = game_id; // We add the id to the data because it's not returned by the API (more practical in the front)
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error: data.detail || "Failed to fetch game. Please try again.",
      };
    }

    console.log("GAME DATA GET FROM API : ", data);

    return {
      data: {
        ...data,
        id: game_id,
      } as GameDetail,
    };
  } catch (error) {
    console.error("Error during fetching game:", error);
    return { error: "Erreur réseau" };
  }
};

export const joinGame = async (game_id: number, name?: string) => {
  const token = await getToken();

  if (!token && !name) {
    return { error: "No auth token found and no name" };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/join`), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
      },
      body: token ? JSON.stringify({}) : JSON.stringify({ name }),
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error: data.detail || "Failed to join game. Please try again.",
      };
    }

    const { access_token } = data as JoinGameResponse;

    // If the user has joined the game as a guest, we need to save the token to cookies
    if (name && access_token) {
      await saveToken(access_token);
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const setGameMode = async (game_id: number, mode: string) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/mode`), {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mode }),
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    // console.log(data);

    if (!res.ok) {
      return {
        error: data.detail || "Failed to change game mode. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const removePlayer = async (
  game_id: number,
  player_username: string,
) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(
      buildApiUrl(`/games/${game_id}/participants/${player_username}`),
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      },
    );

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    // console.log(data);

    if (!res.ok) {
      return {
        error: data.detail || "Failed to remove player. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const leaveGame = async (game_id: number) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/leave`), {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error: data.detail || "Failed to leave game. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const startGame = async (game_id: number) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/start`), {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error: data.detail || "Failed to launch game. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const validateParticipation = async (game_id: number) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/validate`), {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error:
          data.detail || "Failed to validate participation. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const rejectParticipation = async (game_id: number) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/reject`), {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error:
          data.detail || "Failed to reject participation. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};
