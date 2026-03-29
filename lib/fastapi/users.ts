"use server";

import { buildApiUrl, toFormUrlEncoded } from "@/utils/requests";
import { getToken, logout, saveToken } from "@/lib/fastapi/auth";

const userData = {
  username: "mbartolas7",
  email: "85bmathias@gmail.com",
  name: "Mathias Bartolas",
};

export const getUserData = async () => {
  const token = await getToken();

  console.log("Getting user data with token:", token);

  if (!token) {
    // throw new Error("No auth token found");
    console.log("No auth token found");
    return false;
  }

  console.log("Token found:", token);

  try {
    const res = await fetch(buildApiUrl("/players/me"), {
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
      await logout(); // Logout user, we don't want to keep an invalid token in cookies
      return {
        error: data.detail || "Getting user data failed.",
      };
    }

    return { ...data, guest: data.username.includes("guest_") }; // We add a guest property to the user data to know if the user is a guest or not (we consider that if the username contains "guest_" then it's a guest user)
  } catch (error) {
    return { error: "Erreur réseau" };
  }
};

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  // math123 / 12345

  try {
    const res = await fetch(buildApiUrl("/auth/login"), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: toFormUrlEncoded({ username, password }),
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Failed to parse response from server.");
    }

    if (!res.ok) {
      console.log("Login failed:", data);
      return {
        error:
          data.detail ||
          "Login failed. Please check your credentials and try again.",
      };
    }

    console.log(data);

    const { access_token } = data;

    // Save the token in cookies if login is successful
    if (access_token) {
      await saveToken(access_token);
    }

    return { data };
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "Erreur réseau" };
  }
};

export const signup = async ({
  username,
  email,
  name,
  age,
  password,
}: {
  username: string;
  email: string;
  name: string;
  age: number;
  password: string;
}) => {
  try {
    const res = await fetch(buildApiUrl("/players/"), {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      // body: toFormUrlEncoded({ username, email, name, age, password }),
      body: JSON.stringify({
        username,
        email,
        name,
        age,
        password,
      }),
      // body: JSON.stringify({
      //   username: "john",
      //   email: "john",
      //   name: "John",
      //   age: 10,
      //   password: "00000",
      // }),
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
          data.detail || "Signup failed. Please check your data and try again.",
      };
    }

    // After successful signup, log the user in immediately
    const loginResult = await login({ username, password });

    return loginResult;
  } catch (error) {
    console.error("Error during signup:", error);
    return { error: "Erreur réseau" };
  }
};
