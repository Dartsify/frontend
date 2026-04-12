import { CircleSlash2 } from "lucide-react";

import Dartboard from "../dartboard";
import LastThreeScores from "../lastThreeScores";

import { GameDetail, Participant } from "@/utils/types";

export default function InProgressGame(game: GameDetail) {
  const { id, participations, mode, start_date, target_location, target_name } =
    game;

  const listItem = (item: Participant, index: number) => {
    const { player_name, current_score } = item;
    return (
      <li
        key={index}
        className="rounded-lg overflow-hidden gradient-bg-light p-4 relative border border-border"
      >
        <p className="text-foreground-soft text-sm-2 font-medium">
          {index + 1}. {player_name}
        </p>

        <div className="flex justify-between items-center mt-1.5 gap-3">
          {/* Current score */}
          <p className="font-black text-xl">{current_score}</p>

          {/* Last 3 Scores */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => {
              return (
                <p
                  key={i}
                  className="p-2 bg-foreground-light rounded-md font-medium border-border"
                >
                  10
                </p>
              );
            })}
          </div>

          {/* Number of darts */}
          <div className="font-medium flex gap-0.5 items-center">
            <p>3</p>
            <CircleSlash2 size={16} />
          </div>
        </div>

        <div className="absolute -right-px -top-px size-11 bg-foreground-light [clip-path:polygon(100%_0,0_0,100%_100%)]">
          <p className="absolute right-1.5 top-1.5 text-xs font-semibold text-foreground-soft">
            12
          </p>
        </div>
      </li>
    );
  };

  return (
    <div className="flex items-start gap-5">
      <ul className="flex flex-col gap-3 flex-1">
        {[
          ...participations,
          ...participations,
          ...participations,
          ...participations,
          ...participations,
          ...participations,
          ...participations,
          ...participations,
        ].map((p, index) => listItem(p, index))}
      </ul>

      <div className="w-2/3 rounded-lg overflow-hidden gradient-bg-light p-4 border border-border sticky top-18">
        <h4 className="card-title">Au tour de Mathias</h4>
        <div className="flex flex-col items-center">
          <LastThreeScores />

          <div className="flex gap-1.5 items-center mt-3">
            <p className="badge badge-neutral outline-border">D10</p>
            <p className="badge badge-neutral outline-border">20</p>
          </div>

          <div className="mt-5">
            <Dartboard
              size={500}
              points={[
                { x: 1, y: 2 },
                { x: 12, y: 19 },
                { x: 79, y: -100 },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
