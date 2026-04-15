"use client";

import { CircleSlash2 } from "lucide-react";

import Dartboard from "../dartboard";
import LastThreeScores from "../lastThreeScores";

import { GameDetail, Participant } from "@/utils/types";

import { useGameStream } from "@/lib/hooks/useGameStream";

export default function InProgressGame(game: GameDetail) {
  const {
    gameData,
    loading: loadingGameData,
    error: gameError,
  } = useGameStream(game.id, game); // We give the initial snapshot to the stream hook to hydrate the state immediately without waiting for the first stream update

  const {
    id,
    participations,
    mode,
    start_date,
    target_location,
    target_name,
    current_player_username,
    current_dart_number,
    current_turn_number,
  } = gameData!; // We are sure that gameData is not null bc we initialize the gameData in the stream with the given snapshot

  // Index of the current player in the participations array
  const currentPlayerIndex = participations.findIndex(
    (p) => p.player_username === current_player_username,
  );

  // Participant Item in the list of players
  const listItem = (item: Participant, index: number) => {
    const { player_name, current_score, current_average } = item;

    // Number of darts thrown by the player
    const numberOfDarts = () => {
      if (index < currentPlayerIndex) {
        return current_turn_number * 3;
      } else if (index === currentPlayerIndex) {
        return (current_turn_number - 1) * 3 + (current_dart_number - 1);
      } else {
        return (current_turn_number - 1) * 3;
      }
    };

    return (
      <li
        key={index}
        className={`rounded-lg overflow-hidden ${index === currentPlayerIndex && "gradient-bg-light"} p-4 relative border border-border`}
      >
        <p className="text-foreground-soft text-sm-2 font-bold">
          {index + 1}. {player_name}
        </p>

        <div className="flex justify-between items-center mt-1.5 gap-3">
          {/* Current score */}
          <p className="font-black text-xl">{current_score}</p>

          {/* Last 3 Scores */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((p, i) => {
              const pointData = item.last_3_points[i] ?? null;
              return (
                <p
                  key={i}
                  className="bg-foreground-light-soft rounded-md font-medium border border-border w-10 text-center py-2.5"
                >
                  {pointData?.total ?? "-"}
                </p>
              );
            })}
          </div>

          {/* Number of darts */}
          <div className="font-medium flex gap-0.5 items-center">
            <p>{current_average}</p>
            <CircleSlash2 size={16} />
          </div>
        </div>

        <div className="absolute -right-px -top-px size-11 bg-foreground-light-soft [clip-path:polygon(100%_0,0_0,100%_100%)]">
          <p className="absolute right-1.5 top-1.5 text-xs font-semibold text-foreground-soft">
            {numberOfDarts()}
          </p>
        </div>
      </li>
    );
  };

  return (
    <div className="flex items-start gap-5">
      <ul className="flex flex-col gap-3 flex-1">
        {participations.map((p, index) => listItem(p, index))}
      </ul>

      <div className="w-2/3 rounded-lg overflow-hidden gradient-bg-light p-4 border border-border sticky top-18">
        <h4 className="card-title">Tour {current_turn_number}</h4>
        <p className="card-subtitle text-base -mt-1.5">
          {participations[currentPlayerIndex]?.player_name}, c'est à vous de
          jouer !
        </p>

        <div className="flex flex-col items-center mt-8">
          <LastThreeScores />

          {participations[currentPlayerIndex]?.checkout_suggestion.length >
            0 && (
            <div className="flex gap-1.5 items-center mt-3">
              {participations[currentPlayerIndex]?.checkout_suggestion.map(
                (s, index) => {
                  return (
                    <p
                      key={index}
                      className="badge badge-neutral outline-border"
                    >
                      {s}
                    </p>
                  );
                },
              )}
            </div>
          )}

          <div className="mt-5">
            <Dartboard
              size={450}
              points={[
                { x: 1, y: 100 },
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
