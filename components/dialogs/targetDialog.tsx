"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useOtpInput } from "@/lib/hooks/useOtpInput";
import { getTargetData } from "@/lib/fastapi/targets";
import { createGame, joinGame } from "@/lib/fastapi/games";

import { UserDataContext } from "@/app/dashboard/providers";

import { DialogControls, Target } from "@/utils/types";

import logo from "@/public/logo.svg";

import { OtpInput } from "../otpInput";
import NeedToLoginDialog from "./needToLoginDialog";
import NameInputDialog from "./nameInputDialog";
import { games } from "@/utils/games";

export default function TargetDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const router = useRouter();

  const [showInput, setShowInput] = useState<boolean>(true);
  const [targetData, setTargetData] = useState<Target | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);

  const [showNeedToLogin, setShowNeedToLogin] = useState<boolean>(false);
  const [showNameInput, setShowNameInput] = useState<boolean>(false);

  const userDataContext = useContext(UserDataContext);
  if (!userDataContext) return <div>Loading...</div>;
  const { userData } = userDataContext;

  const otpInput = useOtpInput();
  const { otp, setOtp } = otpInput;

  const target_id = useCallback(() => otp.join(""), [otp])();

  // Executes on otp changes (when user types or deletes a digit)
  useEffect(() => {
    if (!otp.includes("")) {
      // Get target data if otp is complete (6 digits)
      getTargetData(target_id).then((res) => {
        // If there's an error, set the error state. Otherwise, set the target data.
        const { data, error } = res;
        if (data) {
          // Set an error if the target is already in use for a game in progress
          // but still set the target data so that the user can see which target it is
          if (data.current_game_status === "in_progress") {
            setTargetError(
              "Cette cible est déjà utilisée pour une partie en cours.",
            );
          }
          setTargetData(data);
        } else {
          if (typeof error === "string") {
            setTargetError(error);
          } else {
            setTargetError("Une erreur est survenue. Veuillez réessayer.");
          }
        }
      });
    } else {
      setTargetData(null);
      setTargetError(null);
    }
  }, [otp]);

  // If the NeedToLoginDialog is closed and the user is now logged in, we can try to create/join the game again without making the user re-enter the otp
  useEffect(() => {
    if (!showNeedToLogin && userData && !otp.includes("")) {
      // Retry to submit
      handleSubmit();
    }
  }, [showNeedToLogin, userData]);

  // Handle close dialog (when user clicks the "cancel" and "X" buttons)
  const handleCloseDialog = () => {
    dialogControls.close();
    router.push("/dashboard/");
  };

  const handleSubmit = async () => {
    if (targetData?.current_game_status === "finished") {
      // If the target has a finished game, we can reuse it and create a new game
      if (!userData) {
        // If the user is not logged in, we can't create a game
        setShowNeedToLogin(true);
        return;
      }
      // If the user is logged in, we can create the game
      // We create a game with a default mode (normally "501", we retrieve the first game from the games array in utils/games.ts) but it can be changed later in the game settings
      const res = await createGame(target_id, games[0].slug);
      const { data, error } = res;

      if (error || !data?.id) {
        setTargetError(
          "Une erreur est survenue lors de la création de la partie. Veuillez réessayer.",
        );
        return;
      }

      handleFinish(data.id);
    } else if (
      targetData?.current_game_status === "waiting" &&
      targetData.current_game_id
    ) {
      // If the target has a waiting game, we can join it
      if (!userData) {
        // If the user is not logged in, we need a username
        //  -> show NameInputDialog to get the username and then join the game
        setShowNameInput(true);
        return;
      }
      // If the user is logged in, we can join the game directly with the username from the user data
      await handleJoinGame();
    }
  };

  // Join the game (available for guests and logged in users)
  const handleJoinGame = async (username?: string) => {
    const current_game_id = targetData?.current_game_id;
    if (current_game_id) {
      const { data, error } = await joinGame(
        current_game_id,
        username, // username is required if the user is not logged in, so if not given in params its not a problem
      );
      if (error) {
        if (typeof error === "string") {
          setTargetError(error);
        } else {
          setTargetError("Une erreur est survenue. Veuillez réessayer.");
        }
      } else {
        // If the user joined as a guest, we save the access token in the local storage to authenticate the user in the game

        handleFinish(current_game_id);
      }
    } else {
      setTargetError("Aucun jeu en attente trouvé pour cette cible.");
    }
  };

  // Execute this function after successfully creating or joining a game to close the dialog and save the target id in the parent component (NewGame)
  const handleFinish = (gameId: number) => {
    if (dialogControls.enter) {
      // If a dialogControls enter function is provided, we call it (here we would want to save the game id in the parent component to show the lobby and then the game page with the right game id)
      dialogControls.enter({ id: gameId });
    }
    // Close the dialog (enter function doesn't close the dialog)
    dialogControls.close();
  };

  // Show NeedToLoginDialog if the user is not logged in but tries to create a game
  if (showNeedToLogin) {
    return (
      <NeedToLoginDialog
        dialogControls={{
          ...dialogControls,
          close: () => setShowNeedToLogin(false), // If the user closes the NeedToLoginDialog, we just hide it and show the TargetDialog again instead of going back to the dashboard
          // enter: () => handleSubmit(),
        }}
      />
    );
  }

  // Show NameInputDialog if the user is not logged in but tries to join a waiting game
  if (showNameInput) {
    return (
      <NameInputDialog
        dialogControls={{
          ...dialogControls,
          close: () => setShowNameInput(false), // If the user closes the NameInputDialog, we just hide it and show the TargetDialog again instead of going back to the dashboard
          enter: ({ username }) => handleJoinGame(username),
        }}
      />
    );
  }

  return (
    <div className="dialog">
      <div className="header">
        <h2>Connectez-vous à une cible Dartsify</h2>
        <div className="btn btn-sm" onClick={handleCloseDialog}>
          <X size={22} />
        </div>
      </div>
      <p className="text-foreground-soft">
        Pour commencer une partie, vous devez être connecté à une cible
        Dartsify. Si vous en avez pas, rendez-vous dans un bar partenaire ou
        achetez-en une sur notre site.
      </p>
      <p className="mt-2">
        Entrez le code à 6 chiffres affiché sur votre cible, ou{" "}
        <span className="brand-link" onClick={() => setShowInput(false)}>
          utilisez la caméra et scannez le QR Code
        </span>{" "}
        pour une connexion plus rapide.
      </p>

      <div className="flex items-center justify-center mt-8">
        <OtpInput otp={otp} setOtp={setOtp} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {targetData && (
          <div className="gradient-bg-light border border-border rounded-lg p-3 flex items-center gap-3">
            <Image src={logo} alt="Logo" width={50} className="w-13" />
            <p className="">
              <span className="font-bold">
                {targetData.name} à {targetData.location}
              </span>
              {targetData.description && (
                <>
                  <br />
                  <span className="text-foreground-soft">
                    {targetData.description}
                  </span>
                </>
              )}
            </p>
          </div>
        )}
        {targetError && (
          <p>
            <span className="text-red-500">{targetError}</span>
          </p>
        )}
      </div>

      <div className="footer">
        <button
          className={`btn btn-destructive-soft`}
          type="submit"
          onClick={handleCloseDialog}
        >
          Annuler
        </button>
        <button
          className={`btn btn-brand ${(otp.includes("") || !!targetError) && "btn-invalid"}`}
          type="submit"
          onClick={handleSubmit}
          disabled={otp.includes("") || !!targetError}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
