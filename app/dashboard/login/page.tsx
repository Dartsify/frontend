"use client";

import { login, signup } from "@/lib/fastapi/users";
import { X } from "lucide-react";
import { ChangeEvent, SubmitEvent, useContext, useState } from "react";
import { ShowLoginPanelContext } from "../providers";

export default function Login() {
  const [showSignUp, setShowSignUp] = useState(false);

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    name: "",
    age: "",
    password: "",
  });

  const showLoginPanelContext = useContext(ShowLoginPanelContext);
  if (!showLoginPanelContext) return <div>Loading...</div>;
  const { showLoginPanel, setShowLoginPanel } = showLoginPanelContext;

  const handleFormInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // name correspond to the field name (i.e. username, email, name, age, password) and value correspond to the field value.
    const { name, value } = event.currentTarget;
    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));
  };

  const isLoginFormValid =
    formValues.username.trim() !== "" && formValues.password.trim() !== "";

  const isSignUpPasswordValid = formValues.password.length >= 6;
  const isSignUpAgeValid = Number(formValues.age) > 0;
  const isSignUpFormComplete =
    formValues.username.trim() !== "" &&
    formValues.email.trim() !== "" &&
    formValues.name.trim() !== "" &&
    formValues.age.trim() !== "" &&
    formValues.password.trim() !== "";
  const isSignUpFormValid =
    isSignUpFormComplete && isSignUpPasswordValid && isSignUpAgeValid;

  const handleSubmitLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = formValues.username.trim();
    const password = formValues.password.trim();

    if (!username || !password) {
      alert("Username et password sont requis.");
      return;
    }

    const res = await login({ username, password });
    console.log(res);
  };

  const handleSubmitSignUp = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = formValues.username.trim();
    const email = formValues.email.trim();
    const name = formValues.name.trim();
    const age = Number(formValues.age);
    const password = formValues.password.trim();

    if (!username || !password || !email || !name || !age) {
      alert("Tous les champs sont requis.");
      return;
    }

    if (password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const res = await signup({ username, email, name, age, password });
    console.log(res);
  };

  return (
    <div className="p-5 bg-background rounded-lg absolute w-150 self-center z-11 border border-border shadow-xs">
      {showSignUp ? (
        <section id="signup-section" className="default-section">
          <div className="flex justify-between items-center">
            <h2>Créer un compte</h2>
            <div
              className="btn btn-sm"
              onClick={() => setShowLoginPanel(false)}
            >
              <X size={22} />
            </div>
          </div>
          <form className="mt-2" onSubmit={handleSubmitSignUp}>
            <div className="input-field pre-text">
              <label htmlFor="username">Nom d'utilisateur</label>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  autoComplete="username"
                  value={formValues.username}
                  onChange={handleFormInputChange}
                  required
                />
                <p>@</p>
              </div>
            </div>
            <div className="input-field">
              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                autoComplete="email"
                value={formValues.email}
                onChange={handleFormInputChange}
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
                value={formValues.name}
                onChange={handleFormInputChange}
                required
              />
            </div>
            <div
              className={`input-field ${formValues.age.trim() !== "" && !isSignUpAgeValid && "input-field-invalid"}`}
            >
              <label htmlFor="age">Âge</label>
              <input
                type="number"
                name="age"
                placeholder="Âge"
                min={1}
                value={formValues.age}
                onChange={handleFormInputChange}
                required
              />
              {formValues.age.trim() !== "" && !isSignUpAgeValid && (
                <p className="text-footer">L'âge doit être supérieur à 0.</p>
              )}
            </div>
            <div
              className={`input-field ${formValues.password !== "" && !isSignUpPasswordValid && "input-field-invalid"}`}
            >
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                autoComplete="current-password"
                value={formValues.password}
                onChange={handleFormInputChange}
                required
              />
              {formValues.password !== "" && !isSignUpPasswordValid && (
                <p className="text-footer">
                  Le mot de passe doit contenir au moins 6 caractères.
                </p>
              )}
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
              <button
                className={`btn btn-dark ${!isSignUpFormValid ? "btn-invalid" : ""}`}
                type="submit"
                disabled={!isSignUpFormValid}
              >
                Créer un compte
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section id="login-section" className="default-section">
          <div className="flex justify-between items-center">
            <h2>Se connecter</h2>
            <div
              className="btn btn-sm"
              onClick={() => setShowLoginPanel(false)}
            >
              <X size={22} />
            </div>
          </div>
          <form className="mt-2" onSubmit={handleSubmitLogin}>
            <div className="input-field pre-text">
              <label htmlFor="username">Nom d'utilisateur</label>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  autoComplete="username"
                  value={formValues.username}
                  onChange={handleFormInputChange}
                  required
                />
                <p>@</p>
              </div>
            </div>
            <div className="input-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formValues.password}
                onChange={handleFormInputChange}
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
              <button
                className={`btn btn-dark ${!isLoginFormValid ? "btn-invalid" : ""}`}
                type="submit"
                disabled={!isLoginFormValid}
              >
                Se connecter
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
