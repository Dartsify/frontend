"use client";

import { Point } from "@/utils/types";

export default function LastThreeScores({ scores }: { scores: Point[] }) {
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
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => {
        return (
          <div
            key={i}
            className="h-22 w-15 bg-foreground-light rounded-md text-2xl font-black border border-border text-center leading-7 items-center justify-center flex"
            onClick={() => alert("Edit point : not implemented yet")}
          >
            <p>
              {scores[i]?.total ?? "-"} <br />
              <span className="font-normal text-lg text-foreground-soft">
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
