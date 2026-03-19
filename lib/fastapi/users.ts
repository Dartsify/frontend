"use server";

import { cookies } from "next/headers";

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
        setTimeout(resolveInner, 5000); // Simulate a delay of 5 seconds for the API call
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
