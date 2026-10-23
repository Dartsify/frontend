import { buildApiUrl } from "@/utils/requests";
import { getToken } from "./auth";

export const undoLastThrow = async ({ game_id }: { game_id: number }) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl("/throws/undo/" + game_id), {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
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
        error: data.detail || "Failed to undo last throw. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Network error" };
  }
};

export const registerManualThrow = async ({
  game_id,
  points,
  multiplier,
}: {
  game_id: number;
  points: number;
  multiplier: number;
}) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl("/throws/manual"), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ game_id, points, multiplier }),
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
        error: data.detail || "Failed to post manual throw. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};
