"use server";

import { getToken } from "@/lib/fastapi/auth";
import { buildApiUrl } from "@/utils/requests";
import { Game } from "@/utils/types";

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

export const joinGame = async (game_id: number, username?: string) => {
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
