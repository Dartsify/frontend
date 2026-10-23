import { useDialog } from "@/lib/hooks/useDialog";

import { GameDetail } from "@/utils/types";

import PlayersListItem from "./playersListItem";

import LastThreeScores from "@/components/lastThreeScores";
import Dialog from "@/components/dialogs/dialog";
import PointKeyboardDialog from "@/components/dialogs/pointKeyboardDialog";
import Dartboard from "@/components/dartboard";
import { mapBackendToDartboard } from "@/utils/games";

export default function CustomInProgressGame({
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
  } = displayedData;

  const participationsSorted = [...participations].sort(
    (a, b) => b.current_score - a.current_score,
  );

  const dialogControls = useDialog();

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
          {participations.map((p, index) => {
            const indexInSorted = participationsSorted.findIndex(
              (ps) => ps.player_username === p.player_username,
            );

            return PlayersListItem(
              p,
              index,
              actualPlayerIndex,
              { current_turn_number, current_dart_number },
              currentPlayerIndex,
              indexInSorted + 1,
            );
          })}
        </ul>

        {transitionPhase === "showing-text" ? (
          <div className="card w-full md:w-2/3 overflow-hidden gradient-bg-light sticky top-18 flex flex-col items-center justify-center p-8 text-center min-h-75">
            <h3 className="text-2xl font-black mb-4">Au joueur suivant !</h3>
            <p className="text-xl font-bold">
              {participations[actualPlayerIndex + 1]?.player_name}, c'est à vous
              de jouer.
            </p>
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
            <h3 className="card-title">
              {animateTurnTransition
                ? "Au joueur suivant !"
                : `${participations[currentPlayerIndex]?.player_name}, c'est à vous de
              jouer !`}
            </h3>
            <p className="card-subtitle text-base">
              {animateTurnTransition
                ? participations[
                    (currentPlayerIndex + 1) % participations.length
                  ]?.player_name + ", c'est bientôt à vous."
                : `Faites plus que
              ${participationsSorted[0]?.current_score} pour prendre la première position.`}{" "}
            </p>

            <div className="flex flex-col items-center mt-8">
              <LastThreeScores
                scores={
                  current_dart_number == 1 // If the player has to throw his first dart, we don't show the last 3 scores of the previous turn because they are one from the previous round
                    ? []
                    : participations[currentPlayerIndex]?.last_3_points || []
                }
                gameId={id}
                dialogControls={dialogControls}
              />

              <div className="mt-5">
                <div className="hidden md:block">
                  <Dartboard
                    size={450}
                    points={[
                      // Map the current player points to show them in blue
                      ...board_hits.current_player.map((i, index) => ({
                        ...mapBackendToDartboard(i.x, i.y),
                        color: "rgb(36,83,255)",
                      })),
                      ...board_hits.others.map((i) => ({
                        ...mapBackendToDartboard(i.x, i.y),
                        color: "rgb(36,83,255, 0.4)",
                      })),
                    ]}
                  />
                </div>

                <div className="block md:hidden">
                  <Dartboard
                    size={300}
                    points={[
                      // Map the current player points to show them in blue
                      ...board_hits.current_player.map((i, index) => ({
                        ...mapBackendToDartboard(i.x, i.y),
                        color: "rgb(36,83,255)",
                      })),
                      ...board_hits.others.map((i) => ({
                        ...mapBackendToDartboard(i.x, i.y),
                        color: "rgb(36,83,255, 0.4)",
                      })),
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Point keyboard */}
      <Dialog dialogControls={dialogControls}>
        <PointKeyboardDialog dialogControls={dialogControls} />
      </Dialog>
    </>
  );
}
