"use server";

import { cookies } from "next/headers";

export const saveToken = async (token: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // maxAge: 60 * 60 * 24 * 7, // 1 week
      maxAge: 60 * 60, // 1 hour
    });
    console.log("Auth token saved in cookies.");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la sauvegarde du token" };
  }
};

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
