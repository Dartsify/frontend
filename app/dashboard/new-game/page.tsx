"use client";

import { login, signup } from "@/lib/fastapi/users";
import Link from "next/link";
import { SubmitEvent } from "react";

export default function NewGame() {
  return (
    <div>
      <h1>Nouvelle partie</h1>

      <main>
        <Link href={"/dashboard/login"}>Login</Link>
      </main>
    </div>
  );
}
