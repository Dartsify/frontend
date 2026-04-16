"use server";

import { getToken } from "./auth";

import { buildApiUrl } from "@/utils/requests";
import {
  Friend,
  FriendRequest,
  PendingInvitation,
  Stats,
  ZonesStats,
  HeatmapData,
} from "@/utils/types";

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

export const sendFriendRequest = async (username: string) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(
      buildApiUrl(`/players/me/friends/request/${username}`),
      {
        method: "POST",
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
          data.detail || "Failed to send friend request. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const acceptFriendRequest = async (username: string) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(
      buildApiUrl(`/players/me/friends/accept/${username}`),
      {
        method: "POST",
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
          data.detail || "Failed to accept friend request. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const rejectFriendRequest = async (username: string) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(
      buildApiUrl(`/players/me/friends/reject/${username}`),
      {
        method: "POST",
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
          data.detail || "Failed to reject friend request. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const removeFriend = async (username: string) => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/players/me/friends/${username}`), {
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
        error: data.detail || "Failed to remove friend. Please try again.",
      };
    }

    return { data };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const getMyStats = async () => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/players/me/stats`), {
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
        error: data.detail || "Failed to get stats. Please try again.",
      };
    }

    return { data: data as Stats };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const getMyZonesStats = async () => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/players/me/zones_stats`), {
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
        error: data.detail || "Failed to get zones stats. Please try again.",
      };
    }

    return { data: data as ZonesStats };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const getMyHeatmap = async () => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/players/me/heatmap`), {
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
        error: data.detail || "Failed to get heatmap. Please try again.",
      };
    }

    return { data: data as HeatmapData };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};

export const getPendingInvitations = async () => {
  const token = await getToken();

  if (!token) {
    return { error: "No auth token found" };
  }

  try {
    const res = await fetch(buildApiUrl(`/players/me/pending`), {
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
        error: data.detail || "Failed to get invitations. Please try again.",
      };
    }

    return { data: data as PendingInvitation[] };
  } catch (error) {
    console.log(error);
    return { error: "Erreur réseau" };
  }
};
