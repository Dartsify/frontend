"use client";

import { login, signup } from "@/lib/fastapi/users";
import { SubmitEvent } from "react";

export default function Login() {
  const handleSubmitLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!username || !password) {
      console.log("Username et password sont requis.");
      return;
    }

    const res = await login({ username, password });
    console.log(res);
  };

  const handleSubmitSignUp = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const age = Number(formData.get("age") ?? 0);
    const password = String(formData.get("password") ?? "").trim();

    if (!username || !password || !email || !name || !age) {
      console.log("Tous les champs sont requis.");
      return;
    }

    const res = await signup({ username, email, name, age, password });
    console.log(res);
  };

  return (
    <div className="p-5 bg-background rounded-lg absolute w-60 self-center">
      <section id="login-section" className="default-section">
        <h2>Se connecter</h2>
        <form onSubmit={handleSubmitLogin}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            autoComplete="username"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            autoComplete="current-password"
            required
          />
          <button type="submit">Se connecter</button>
        </form>
      </section>

      <section id="signup-section" className="default-section">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmitSignUp}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            autoComplete="username"
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Adresse email"
            autoComplete="email"
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            autoComplete="name"
            required
          />
          <input type="number" name="age" placeholder="Âge" required />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            autoComplete="current-password"
            required
          />
          <button type="submit">Créer un compte</button>
        </form>
      </section>
    </div>
  );
}
