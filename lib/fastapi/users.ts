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

  await new Promise((resolveOuter) => {
    resolveOuter(
      new Promise((resolveInner) => {
        setTimeout(resolveInner, 2000); // Simulate a delay of 2 seconds for the API call
        console.log("Simulating API call to fetch user data...");
      }),
    );
  });

  return false;

  if (!token) {
    console.log("No auth token found in cookies.");
    return false;
  }

  console.log("Token from cookies:", token);

  //   return userData;
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

  const res = await fetch(buildApiUrl("/auth/login"), {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toFormUrlEncoded({ username, password }),
  });

  const resJson = await res.json();
  console.log("res json login", resJson);

  return resJson;
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
  const res = await fetch(buildApiUrl("/players/"), {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    // body: toFormUrlEncoded({ username, email, name, age, password }),
    body: JSON.stringify({ username, email, name, age, password }),
  });

  const resJson = await res.json();
  console.log("res json signup", resJson);

  return resJson;
};
