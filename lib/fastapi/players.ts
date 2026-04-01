"use server";

import { getToken } from "./auth";

import { buildApiUrl } from "@/utils/requests";
import { Friend, FriendRequest } from "@/utils/types";

export const getMyFriends = async (search?: string) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(
      buildApiUrl(`/players/me/friends${search ? `?search=${search}` : ""}`),
      {
        method: "GET",
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

    if (!res.ok) {
      return {
        error:
          data.detail || "Failed to get list of friends. Please try again.",
      };
    }

    return { data: data as Friend[] };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const getMyFriendsRequests = async () => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/players/me/friends/requests`), {
      method: "GET",
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
        error:
          data.detail || "Failed to get requests of friends. Please try again.",
      };
    }

    return { data: data as FriendRequest[] };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};
