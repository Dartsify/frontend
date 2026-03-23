"use server";

import { cookies } from "next/headers";

const toFormUrlEncoded = (data: Record<string, string | number | boolean>) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  return params.toString();
};

const buildApiUrl = (path: string) => {
  const baseUrl = process.env.BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error("BASE_URL is not defined");
  }

  const normalizedBaseUrl = /^https?:\/\//i.test(baseUrl)
    ? baseUrl
    : `http://${baseUrl}`;

  return new URL(path, normalizedBaseUrl).toString();
};

const userData = {
  username: "mbartolas7",
  email: "85bmathias@gmail.com",
  full_name: "Mathias Bartolas",
};

export const getUserData = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  console.log("gettings token from cookies...");

  // await new Promise((resolveOuter) => {
  //   resolveOuter(
  //     new Promise((resolveInner) => {
  //       setTimeout(resolveInner, 500); // Simulate a delay of 2 seconds for the API call
  //       console.log("Simulating API call to fetch user data...");
  //     }),
  //   );
  // });

  // return false;

  if (!token) {
    console.log("No auth token found in cookies.");
    return false;
  }

  console.log("Token from cookies:", token);

  const res = await fetch(buildApiUrl("/players/me"), {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const resJson = await res.json();
  console.log("Response from /players/me:", resJson);

  if (res.ok) {
    return resJson;
  }

  console.error("Failed to fetch user data:", res.status, res.statusText);

  return false;
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
      return {
        error:
          data.detail ||
          "Login failed. Please check your credentials and try again.",
      };
    }

    const { access_token } = data;

    // Save the token in cookies if login is successful
    if (access_token) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // maxAge: 60 * 60 * 24 * 7, // 1 week
        maxAge: 60 * 60, // 1 hour
      });
      console.log("Auth token saved in cookies.");
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
    // const { access_token } = data;

    // console.log("data du signup", data);

    // // Store the token in cookies if signup is successful
    // if (access_token) {
    //   const cookieStore = await cookies();
    //   cookieStore.set("auth_token", access_token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     // maxAge: 60 * 60 * 24 * 7, // 1 week
    //     maxAge: 60 * 60, // 1 hour
    //   });
    //   console.log("Auth token saved in cookies.");
    // }

    // return data;
  } catch (error) {
    console.error("Error during signup:", error);
    return { error: "Erreur réseau" };
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  console.log("Auth token removed from cookies.");
};
