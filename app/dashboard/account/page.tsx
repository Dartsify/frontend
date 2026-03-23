"use client";

import { useContext } from "react";
import { UserDataContext } from "../providers";
import { logout } from "@/lib/fastapi/users";

export default function Account() {
  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  return (
    <div>
      <h1>Mon Compte</h1>

      {userData ? (
        <>
          <p>Bienvenue, {userData.username} !</p>
          <p>Email: {userData.email}</p>
          <p>Nom complet: {userData.name}</p>
        </>
      ) : (
        <p>Vous n'êtes pas connecté.</p>
      )}

      <button
        type="button"
        className="btn btn-destructive mt-10"
        onClick={() => logout()}
      >
        Se déconnecter
      </button>
    </div>
  );
}
