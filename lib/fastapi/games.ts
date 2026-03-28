"use server";

import { getToken } from "@/lib/fastapi/auth";
import { buildApiUrl } from "@/utils/requests";
import { Game, GameDetail, GameStatus } from "@/utils/types";

export const createGame = async (target_id: string, mode: string) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

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

    return { data: data as Game };
  } catch (error) {
    console.error("Error during creating a game :", error);
    return { error: "Erreur réseau" };
  }
};

export const addPlayer = async (game_id: number, username?: string) => {
  const token = await getToken();

  if (!token && !username) {
    console.log("No auth token found and no username provided");
    return {
      error: "Vous devez fournir un nom d'utilisateur ou vous connectez.",
    };
  }

  try {
    const res = await fetch(buildApiUrl(`/games/${game_id}/add_player`), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: token ? `Bearer ${token}` : "",
      },
      body: token ? "" : JSON.stringify({ username }),
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
        error: data.detail || "Failed to add player to game. Please try again.",
      };
    }

    console.log("Player added to game successfully:", data);

    return { data };
  } catch (error) {
    console.error("Error during adding player to game:", error);
    return { error: "Erreur réseau" };
  }
};

export const getGames = async (status?: GameStatus[]) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(
      // If a status is provided, we add it as a query parameter to filter games by status, otherwise we get all games
      buildApiUrl(
        `/games/?limit=10${status && `&status=${status.join("&status=")}`}`,
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
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      return {
        error: data.detail || "Failed to fetch game. Please try again.",
      };
    }

    return { data: data as GameDetail };
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
      body: token ? "" : JSON.stringify({ name }),
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

    console.log(data);

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

    console.log(data);

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
