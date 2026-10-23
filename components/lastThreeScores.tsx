"use client";

import { registerManualThrow, undoLastThrow } from "@/lib/fastapi/throws";
import { DialogControls, Point } from "@/utils/types";
import Dialog from "./dialogs/dialog";
import PointKeyboardDialog from "./dialogs/pointKeyboardDialog";
import { useDialog } from "@/lib/hooks/useDialog";

export default function LastThreeScores({
  scores,
  gameId,
  dialogControls, // We need the dialog controls of the pointKeyboardDialog to open it when the user clicks on a score to edit it (if we declare a new dialogControls here, it will be in the turn section bc of the fixed position value of the section...)
}: {
  scores: Point[];
  gameId: number;
  dialogControls: DialogControls;
}) {
  const multiplierText = (multiplier: number) => {
    switch (multiplier) {
      case 2:
        return "D";
      case 3:
        return "T";
      default:
        return "";
    }
  };

  const handleRegisterManualThrow = async (index: number) => {
    const score = scores[index];

    if (score === undefined) {
      // No score exists for this index -> we check if a score has been registered for the previous dart
      if ((index > 0 && scores[index - 1] !== undefined) || index === 0) {
        // No no registered previous dart -> we can register the score
        dialogControls.setEnter(async ({ point }) => {
          // We set the enter action of the dialog -> here we can specify what it will be done after receiving the data from the dialog (the point)
          // HERE WE DON'T NEED TO REMOVE THE LAST SCORE
          if (point) {
            const { points, multiplier, total } = point;

            const res = await registerManualThrow({
              game_id: gameId,
              points,
              multiplier,
            });

            const { error, data } = res;

            if (error) {
              if (typeof error === "string") {
                alert(error);
              } else {
                alert(
                  "Une erreur est survenue lors de l'enregistrement du score. Veuillez réessayer.",
                );
              }
            }
          }
        });
        dialogControls.open();
      } else {
        alert(
          "Vous ne pouvez pas enregistrer ce score car il n'y a pas de score précédent. Veuillez d'abord enregistrer les scores précédents.",
        );
      }
    } else {
      // A score exists for this index -> we can only edit it if it's the last one
      if (index === scores.length - 1) {
        dialogControls.setEnter(async ({ point }) => {
          // We set the enter action of the dialog -> here we can specify what it will be done after receiving the data from the dialog (the point)
          // HERE WE NEED TO REMOVE THE LAST SCORE
          if (point) {
            const { points, multiplier, total } = point;

            const res_undo = await undoLastThrow({ game_id: gameId });

            const { error: undo_error, data: undo_data } = res_undo;

            if (undo_error) {
              if (typeof undo_error === "string") {
                alert(undo_error);
              } else {
                alert(
                  "Une erreur est survenue lors de la suppression du dernier score. Veuillez réessayer.",
                );
              }
            }

            const res_register = await registerManualThrow({
              game_id: gameId,
              points,
              multiplier,
            });

            const { error: register_error, data: register_data } = res_register;

            if (register_error) {
              if (typeof register_error === "string") {
                alert(register_error);
              } else {
                alert(
                  "Une erreur est survenue lors de l'enregistrement du score. Veuillez réessayer.",
                );
              }
            }
          }
        });
        dialogControls.open();
      }
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => {
        return (
          <div
            key={i}
            className="h-18 md:h-22 w-13 md:w-15 bg-foreground-light rounded-md text-2xl font-black border border-border text-center leading-7 items-center justify-center flex"
            onClick={() => handleRegisterManualThrow(i)}
          >
            <p>
              {scores[i]?.total ?? "-"} <br />
              <span className="font-normal text-base md:text-lg text-foreground-soft">
                {multiplierText(scores[i]?.multiplier ?? 1)}
                {scores[i]?.points}
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
