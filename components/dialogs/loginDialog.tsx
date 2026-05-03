"use client";

import { ChangeEvent, SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed, X } from "lucide-react";

import { login, signup } from "@/lib/fastapi/users";
import { DialogControls, FieldError } from "@/utils/types";
import { testIfErrorMatchesFieldErrorType } from "@/utils/requests";

// Notes sur les erreurs en retour de l'API :
//  - Adrien retourne lui même les erreurs du login, il ne retourne qu'un string qui comprend un message d'erreur. Par exemple : "Invalid username" ou "Invalid password". Je crée donc moi même un objet FieldError qui contient le field ko, le message d'erreur à afficher ainsi que l'input qui a causé l'erreur.
//  - Pour le signup, FastAPI retourne un message d'erreur plus générique avec une syntaxe bien précise. Il contient une liste d'erreurs avec pour chacune un loc qui contient le field concerné, un msg qui contient le message d'erreur à afficher et un type qui contient le type de l'erreur. Par exemple : {"detail":[{"loc":["body","email"],"msg":"value is not a valid email address","type":"value_error.email"}]}

// Finalement => retour généralisé, retourne une liste de FieldError pour les deux endpoints

export default function LoginDialog({
  dialogControls,
  showHeader = true,
}: {
  dialogControls: DialogControls;
  showHeader?: boolean;
}) {
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    name: "",
    age: "",
    password: "",
  });

  const [signInError, setSignInError] = useState<FieldError[] | null>(null);
  const [signUpError, setSignUpError] = useState<FieldError[] | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const hasBlockingErrorFromSameValue = (errors: FieldError[] | null) => {
    if (!errors || errors.length === 0) {
      return false;
    }

    return errors.some((error) => {
      const currentValue = formValues[error.field as keyof typeof formValues];

      if (currentValue === undefined) {
        return false;
      }

      return String(error.value ?? "").trim() === String(currentValue).trim();
    });
  };

  const handleFormInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // name correspond to the field name (i.e. username, email, name, age, password) and value correspond to the field value.
    const { name, value } = event.currentTarget;
    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: name == "username" ? value.toLowerCase() : value,
    }));
  };

  const isLoginFormValid =
    formValues.username.trim() !== "" && formValues.password.trim() !== "";

  const hasBlockingSignInError = hasBlockingErrorFromSameValue(signInError);

  // Le bouton login est desactivé si le form est incomplet
  // ou si on est encore sur la meme valeur en erreur.
  const isSignInSubmitDisabled = !isLoginFormValid || hasBlockingSignInError;

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

  const hasBlockingSignUpErrors = hasBlockingErrorFromSameValue(signUpError);

  // Le bouton signup est desactive si le form est invalide
  // ou si au moins une erreur API correspond encore a la valeur actuelle.
  const isSignUpSubmitDisabled = !isSignUpFormValid || hasBlockingSignUpErrors;

  const handleSubmitLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = formValues.username.trim();
    const password = formValues.password.trim();

    if (!username || !password) {
      alert("Username et password sont requis.");
      return;
    }

    const res = await login({ username, password });
    const { data, error } = res;

    if (error) {
      if (testIfErrorMatchesFieldErrorType(error)) {
        setSignInError(error);
      } else {
        alert(
          "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
        );
      }
    } else {
      // Refresh the server layout to re-fetch user data with the new token
      router.refresh();
      // On ferme la dialog après une connexion réussie
      dialogControls.close();
    }
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
    const { data, error } = res;

    if (error) {
      if (testIfErrorMatchesFieldErrorType(error)) {
        setSignUpError(error);
      } else {
        alert(
          "Une erreur est survenue lors de la inscription. Veuillez réessayer.",
        );
      }
    } else {
      // Refresh the server layout to re-fetch user data with the new token
      router.refresh();
      dialogControls.close();
    }
  };

  const getErrorFromFieldsError = (
    fieldName: string,
    type: "signin" | "signup",
  ): string | null => {
    let fieldError;
    if (type == "signin") {
      if (!signInError) return null;
      fieldError = signInError.find((e) => e.field === fieldName);
    } else if (type == "signup") {
      if (!signUpError) return null;
      fieldError = signUpError.find((e) => e.field === fieldName);
    }
    return fieldError ? fieldError.message : null;
  };

  return (
    <div className="dialog">
      {showHeader && (
        <div className="header">
          <h2>{showSignUp ? "Créer un compte" : "Se connecter"}</h2>
          <div className="btn btn-sm" onClick={dialogControls.close}>
            <X size={22} />
          </div>
        </div>
      )}

      {showSignUp ? (
        <form className="mt-2" onSubmit={handleSubmitSignUp}>
          <div className="input-field pre-text">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div>
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                value={formValues.username}
                onChange={handleFormInputChange}
                required
              />
              <p>@</p>
            </div>
          </div>
          <div
            className={`input-field ${getErrorFromFieldsError("email", "signup") && "input-field-invalid"}`}
          >
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
            {getErrorFromFieldsError("email", "signup") && (
              <p className="text-footer">
                {getErrorFromFieldsError("email", "signup")}
              </p>
            )}
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
            className={`input-field ${((formValues.password !== "" && !isSignUpPasswordValid) || getErrorFromFieldsError("password", "signup")) && "input-field-invalid"}`}
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
            {getErrorFromFieldsError("password", "signup") && (
              <p className="text-footer">
                {getErrorFromFieldsError("password", "signup")}
              </p>
            )}
          </div>

          <p>
            Vous avez déjà un compte ?{" "}
            <button
              type="button"
              className="brand-link"
              onClick={() => setShowSignUp(false)}
            >
              Connectez-vous
            </button>
            .
          </p>

          <div className="footer">
            {dialogControls.back && (
              <button
                className="btn btn-destructive-soft"
                type="button"
                onClick={dialogControls.back}
              >
                Retour
              </button>
            )}
            <button
              className={`btn btn-brand ${isSignUpSubmitDisabled ? "btn-invalid" : ""}`}
              type="submit"
              disabled={isSignUpSubmitDisabled}
            >
              Créer un compte
            </button>
          </div>
        </form>
      ) : (
        <form className="mt-2" onSubmit={handleSubmitLogin}>
          <div
            className={`input-field pre-text ${getErrorFromFieldsError("username", "signin") && "input-field-invalid"}`}
          >
            <label htmlFor="username">Nom d'utilisateur</label>
            <div>
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                autoCorrect="false"
                value={formValues.username}
                onChange={handleFormInputChange}
                required
              />
              <p>@</p>
            </div>
            {getErrorFromFieldsError("username", "signin") && (
              <p className="text-footer">
                {getErrorFromFieldsError("username", "signin")}
              </p>
            )}
          </div>
          <div
            className={`input-field ${getErrorFromFieldsError("password", "signin") && "input-field-invalid"}`}
          >
            <div className="flex justify-between items-center">
              <label htmlFor="password">Mot de passe</label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="btn btn-ghost"
              >
                {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={formValues.password}
              onChange={handleFormInputChange}
              required
            />
            {getErrorFromFieldsError("password", "signin") && (
              <p className="text-footer">
                {getErrorFromFieldsError("password", "signin")}
              </p>
            )}
          </div>

          <p>
            Vous n'avez pas de compte ?{" "}
            <button
              type="button"
              className="brand-link"
              onClick={() => setShowSignUp(true)}
            >
              Inscrivez-vous
            </button>
            .
          </p>

          <div className="footer">
            {dialogControls.back && (
              <button
                className="btn btn-destructive-soft"
                type="button"
                onClick={dialogControls.back}
              >
                Retour
              </button>
            )}
            <button
              className={`btn btn-brand ${isSignInSubmitDisabled ? "btn-invalid" : ""}`}
              type="submit"
              disabled={isSignInSubmitDisabled}
            >
              Se connecter
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
