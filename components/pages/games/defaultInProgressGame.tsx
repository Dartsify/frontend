import Dartboard from "@/components/dartboard";
import { GameDetail } from "@/utils/types";
import PlayersListItem from "./playersListItem";
import LastThreeScores from "@/components/lastThreeScores";
import { mapBackendToDartboard } from "@/utils/games";

export default function DefaultInProgressGame({
  currentPlayerIndex,
  actualPlayerIndex,
  displayedData,
  transitionPhase,
  isRoundTransition,
  transitionMessage,
  animateTurnTransition,
  transitionDuration,
  freezeBoardDuration,
}: {
  currentPlayerIndex: number;
  actualPlayerIndex: number;
  displayedData: GameDetail;
  transitionPhase: "none" | "showing-board" | "showing-text" | "game-finished";
  isRoundTransition: boolean;
  transitionMessage: string;
  animateTurnTransition: boolean;
  transitionDuration: number;
  freezeBoardDuration: number;
}) {
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
    board_hits,
  } = displayedData; // We are sure that gameData is not null bc we initialize the gameData in the stream with the given snapshot

  return (
    <>
      {/* Loading indicator between turn players */}
      {transitionPhase !== "none" && (
        <div className="w-full h-2 relative rounded-xl -mb-5 border border-border overflow-hidden">
          <div
            className={`h-full absolute inset-0 bg-linear-[90deg,var(--color-brand)_50%,var(--color-background)_50%] bg-size-[200%_100%] ${animateTurnTransition ? "bg-position-[0%]" : "bg-position-[100%]"} transition-[background-position] ease-linear`}
            style={{
              transitionDuration: `${transitionDuration + freezeBoardDuration}ms`,
            }}
          />
        </div>
      )}
      <div className="flex flex-col-reverse md:flex-row items-start gap-5">
        <ul className="grid grid-cols-2 md:flex md:flex-col gap-3 flex-1 w-full md:w-auto">
          {participations.map((p, index) =>
            PlayersListItem(
              p,
              index,
              actualPlayerIndex,
              { current_turn_number, current_dart_number },
              currentPlayerIndex,
            ),
          )}
        </ul>

        {transitionPhase === "showing-text" ? (
          <div className="card w-full md:w-2/3 overflow-hidden gradient-bg-light sticky top-18 flex flex-col items-center justify-center p-8 text-center min-h-75">
            <h3 className="text-2xl font-black mb-4">
              {isRoundTransition ? "Nouveau Tour !" : "Tour Suivant !"}
            </h3>
            <p className="text-xl font-bold">{transitionMessage}</p>
          </div>
        ) : transitionPhase === "game-finished" ? (
          <div className="card w-full md:w-2/3 overflow-hidden gradient-bg-light sticky top-18 flex flex-col items-center justify-center p-8 text-center min-h-75">
            <h3 className="text-2xl font-black mb-4">Bravo ! 🎯</h3>
            <p className="text-xl font-bold">
              La partie est terminée, chargement des statistiques...
            </p>
          </div>
        ) : (
          <div
            className={`card w-full md:w-2/3 overflow-hidden gradient-bg-light md:sticky top-18`}
          >
            <h3 className="card-title">Tour {current_turn_number}</h3>
            <p className="card-subtitle text-base">
              {participations[currentPlayerIndex]?.player_name}, c'est à vous de
              jouer !{" "}
              {animateTurnTransition &&
                participations[(currentPlayerIndex + 1) % participations.length]
                  ?.player_name + ", c'est bientôt à vous !"}{" "}
            </p>

            <div className="flex flex-col items-center mt-8">
              <LastThreeScores
                scores={
                  current_dart_number == 1 // If the player has to throw his first dart, we don't show the last 3 scores of the previous turn because they are one from the previous round
                    ? []
                    : participations[currentPlayerIndex]?.last_3_points || []
                }
              />

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
                <div className="hidden md:block">
                  <Dartboard
                    size={450}
                    points={board_hits.current_player.map((i, index) => ({
                      ...mapBackendToDartboard(i.x, i.y),
                      color:
                        index <=
                        board_hits.current_player.length - current_dart_number
                          ? "rgba(36,83,255,0.40)"
                          : undefined,
                    }))}
                  />
                </div>

                <div className="block md:hidden">
                  <Dartboard
                    size={300}
                    points={board_hits.current_player.map((i, index) => ({
                      ...mapBackendToDartboard(i.x, i.y),
                      color:
                        index <=
                        board_hits.current_player.length - current_dart_number
                          ? "rgba(36,83,255,0.40)"
                          : undefined,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
