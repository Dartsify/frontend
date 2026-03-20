"use client";

import { login, signup } from "@/lib/fastapi/users";
import Link from "next/link";
import { SubmitEvent, useContext } from "react";
import { ShowLoginPanelContext } from "../providers";

export default function NewGame() {
  const showLoginPanelContext = useContext(ShowLoginPanelContext);
  if (!showLoginPanelContext) return <div>Loading...</div>;
  const { showLoginPanel, setShowLoginPanel } = showLoginPanelContext;

  return (
    <div>
      <h1>Nouvelle partie</h1>

      <main>
        {/* <Link href={"/dashboard/login"}>Login</Link> */}
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => setShowLoginPanel((prev) => !prev)}
        >
          {showLoginPanel
            ? "Fermer le panneau de connexion"
            : "Ouvrir le panneau de connexion"}
        </button>
      </main>
    </div>
  );
}
