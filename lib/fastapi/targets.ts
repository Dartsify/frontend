"use server";

{
  /* 858447 */
}

import { buildApiUrl } from "@/utils/requests";
import { Target } from "@/utils/types";

export const getTargetData = async (id: string) => {
  try {
    const res = await fetch(buildApiUrl(`/targets/${id}`), {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
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
        error: data.detail || "Failed to fetch target data. Please try again.",
      };
    }

    return { data: data as Target };
  } catch (error) {
    console.error("Error during retrieving target data:", error);
    return { error: "Erreur réseau" };
  }
};
