"use server";

import { cookies } from "next/headers";

export const getToken = async () => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value ?? null;
  } catch (error) {
    console.error("Error accessing cookies:", error);
    return null;
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  console.log("Auth token removed from cookies.");
};
