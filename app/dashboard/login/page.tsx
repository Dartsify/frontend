"use client";

import { login, signup } from "@/lib/fastapi/users";
import { SubmitEvent, useState } from "react";

export default function Login() {
  const [showSignUp, setShowSignUp] = useState(false);

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
    <div className="p-5 bg-background rounded-lg absolute w-150 self-center z-11 border border-border">
      {showSignUp ? (
        <section id="signup-section" className="default-section">
          <h2>Créer un compte</h2>
          <form onSubmit={handleSubmitSignUp}>
            <div className="input-field">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                autoComplete="username"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                autoComplete="email"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                name="name"
                placeholder="Nom complet"
                autoComplete="name"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="age">Âge</label>
              <input type="number" name="age" placeholder="Âge" required />
            </div>
            <div className="input-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                autoComplete="current-password"
                required
              />
            </div>

            <p>
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => setShowSignUp(false)}
              >
                Connectez-vous
              </button>
              .
            </p>

            <div className="mt-6 justify-end flex">
              <button className="btn btn-dark" type="submit">
                Créer un compte
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section id="login-section" className="default-section">
          <h2>Se connecter</h2>
          <form onSubmit={handleSubmitLogin}>
            <div className="input-field">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                autoComplete="username"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mot de passe"
                autoComplete="current-password"
                required
              />
            </div>

            <p>
              Vous n'avez pas de compte ?{" "}
              <button
                type="button"
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => setShowSignUp(true)}
              >
                Inscrivez-vous
              </button>
              .
            </p>

            <div className="mt-6 justify-end flex">
              <button className="btn btn-dark" type="submit">
                Se connecter
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
