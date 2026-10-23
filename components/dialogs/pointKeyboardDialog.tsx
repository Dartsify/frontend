"use client";

import { useContext, useEffect, useState } from "react";
import { X } from "lucide-react";

import { DialogControls, Point } from "@/utils/types";
import points from "@/utils/points";

import { UserDataContext } from "@/app/dashboard/providers";

export default function PointKeyboardDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const [multiplier, setMultiplier] = useState(1);

  const userDataContext = useContext(UserDataContext);

  if (!userDataContext) return <div>Loading...</div>;

  // If the dialog is closed, we reset the multiplier to 1
  useEffect(() => {
    if (!dialogControls.isOpen) {
      setMultiplier(1);
    }
  }, [dialogControls.isOpen]);

  const handleSelectMultiplier = (m: number) => {
    if (multiplier === 1) {
      // If the multiplier is 1 -> we set it to the selected multiplier
      setMultiplier(m);
    } else if (multiplier === m) {
      // If the multiplier is already set to the selected multiplier -> we reset it to 1
      setMultiplier(1);
    } else {
      // If the multiplier is already set to another multiplier -> we set it to the selected multiplier
      setMultiplier(m);
    }
  };

  const handleSelectPoint = (point: number) => {
    const data: Point = {
      points: point,
      multiplier,
      total: point * multiplier,
    };

    // We close the dialog and send the data to the enter action
    if (dialogControls.enter) {
      dialogControls.enter({ point: data });
    }
    dialogControls.close();
  };

  return (
    <div className="dialog">
      <div className="header">
        <h2>Sélectionnez un point</h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>

      <p className="text-foreground-soft">
        Cliquez sur un score pour modifer le score manuellement.
      </p>

      <div className="mt-5 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 px-1">
        {points.map((point, index) => {
          return (
            <p
              key={index}
              className="bg-background-dark border-border border-2 rounded-md text-center cursor-pointer hover:scale-105 animate transition-all duration-300 ease-in-out px-3 py-1 font-medium text-foreground"
              onClick={() => handleSelectPoint(point)}
            >
              {point}
            </p>
          );
        })}
        <p
          className={`uppercase col-span-2 bg-alice-blue-100 border-border border-2 rounded-md text-center cursor-pointer hover:scale-105 animate transition-all duration-300 ease-in-out px-3 py-1 font-semibold text-foreground ${multiplier === 2 ? "bg-brand text-foreground-light border-foreground-light" : ""}`}
          onClick={() => handleSelectMultiplier(2)}
        >
          Double
        </p>
        <p
          className={`uppercase col-span-2 bg-alice-blue-100 border-border border-2 rounded-md text-center cursor-pointer hover:scale-105 animate transition-all duration-300 ease-in-out px-3 py-1 font-semibold text-foreground ${multiplier === 3 ? "bg-brand text-foreground-light border-foreground-light" : ""}`}
          onClick={() => handleSelectMultiplier(3)}
        >
          Triple
        </p>
      </div>

      <div className="footer">
        <button
          className={`btn btn-destructive-soft`}
          type="submit"
          onClick={dialogControls.close}
        >
          Retour
        </button>
      </div>
    </div>
  );
}
