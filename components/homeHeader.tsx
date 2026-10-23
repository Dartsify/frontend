"use client";

import { useContext } from "react";

import { UserDataContext } from "@/app/dashboard/providers";

export default function HomeHeader() {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const { name, username } = userData ?? {};

  return (
    <header>
      <h1>Bonjour @{username} 👋</h1>
    </header>
  );
}
