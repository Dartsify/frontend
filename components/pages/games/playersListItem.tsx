import { Participant } from "@/utils/types";
import { CircleSlash2 } from "lucide-react";

// Participant Item in the list of players

export default function PlayersListItem(
  item: Participant,
  index: number,
  actualPlayerIndex: number,
  dartsData: { current_turn_number: number; current_dart_number: number },
  currentPlayerIndex: number,
) {
  const { player_name, current_score, current_average } = item;
  const { current_turn_number, current_dart_number } = dartsData;

  // Number of darts thrown by the player
  const numberOfDarts = () => {
    // Find actual index ignoring transitionPhase to calculate darts correctly

    if (index < actualPlayerIndex) {
      return current_turn_number * 3;
    } else if (index === actualPlayerIndex) {
      return (current_turn_number - 1) * 3 + (current_dart_number - 1);
    } else {
      return (current_turn_number - 1) * 3;
    }
  };
  return (
    <li
      key={index}
      className={`card overflow-hidden ${index === currentPlayerIndex && "gradient-bg-light"} p-4 relative w-full md:w-auto`}
    >
      <p className="text-foreground-soft text-sm-2 font-bold">
        {index + 1}. {player_name}
      </p>

      <div className="flex justify-between items-center mt-1.5 gap-3">
        {/* Current score */}
        <p className="font-black text-xl">{current_score}</p>

        {/* Last 3 Scores for md screens */}
        <div className="hidden md:flex items-center gap-1.5">
          {[0, 1, 2].map((p, i) => {
            const pointData = item.last_3_points[i] ?? null;
            return (
              <p
                key={i}
                className="bg-foreground-light-soft rounded-md font-medium border border-border w-8 md:w-10 text-center py-2 md:py-2.5"
              >
                {pointData?.total ?? "-"}
              </p>
            );
          })}
        </div>

        {/* Average score */}
        <div className="font-medium flex gap-0.5 items-center">
          <p>{current_average}</p>
          <CircleSlash2 size={16} />
        </div>
      </div>

      {/* Last 3 Scores for mobile */}
      <div className="flex md:hidden items-center self-center gap-1.5 mt-3">
        {[0, 1, 2].map((p, i) => {
          const pointData = item.last_3_points[i] ?? null;
          return (
            <p
              key={i}
              className="bg-foreground-light-soft rounded-md font-medium border border-border w-8 md:w-10 text-center py-2 md:py-2.5"
            >
              {pointData?.total ?? "-"}
            </p>
          );
        })}
      </div>

      <div className="absolute right-0 top-0 size-11 bg-foreground-light-soft [clip-path:polygon(100%_0,0_0,100%_100%)]">
        <p className="absolute right-2 top-2 text-xs font-semibold text-foreground-soft">
          {numberOfDarts()}
        </p>
      </div>
    </li>
  );
}
