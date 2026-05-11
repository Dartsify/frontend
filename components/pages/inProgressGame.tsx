"use client";

import { CircleSlash2 } from "lucide-react";

import Dartboard from "../dartboard";
import LastThreeScores from "../lastThreeScores";

import { GameDetail, Participant } from "@/utils/types";

import { useGameStream } from "@/lib/hooks/useGameStream";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mapBackendToDartboard } from "@/utils/games";

const transitionDuration = 2500; // Durée d'affichage du texte en ms
const freezeBoardDuration = 1500; // Durée d'affichage de la cible avant texte

export default function InProgressGame(game: GameDetail) {
  const router = useRouter();
  const [transitionPhase, setTransitionPhase] = useState<
    "none" | "showing-board" | "showing-text" | "game-finished"
  >("none");
  const [isRoundTransition, setIsRoundTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState("");

  const [animateTurnTransition, setAnimateTurnTransition] = useState(false);
  const [frozenGameData, setFrozenGameData] = useState<GameDetail | null>(null);

  const {
    gameData,
    loading: loadingGameData,
    error: gameError,
  } = useGameStream(game.id, game, {
    onTurnChange: (newPlayer, oldPlayer, newGameState, previousGameState) => {
      console.log(`C'est au tour de ${newPlayer} (précédemment ${oldPlayer})`);

      // On fige l'écran sur le joueur précédent, mais AVEC ses nouveaux scores fraîchement marqués (newGameState).
      // On utilise 'previousGameState' pour garder le focus visuel sur l'ancien joueur.
      const syntheticState: GameDetail = {
        ...newGameState,
        current_player_username: oldPlayer,
        current_turn_number: previousGameState.current_turn_number,
        current_dart_number: 4, // Permet d'afficher que 3 fléchettes ont été lancées dans numberOfDarts
        board_hits: {
          current_player:
            newGameState.board_hits.others.length > 0
              ? newGameState.board_hits.others // Si le backend a transféré ses fléchettes dans 'others'
              : previousGameState.board_hits.current_player, // Sinon, on garde au moins ses 2 premières
          others: [],
        },
      };

      setFrozenGameData(syntheticState);
      setTransitionPhase("showing-board");
      setIsRoundTransition(false);

      const newPlayerObj = newGameState.participations.find(
        (p) => p.player_username === newPlayer,
      );
      const newPlayerName = newPlayerObj ? newPlayerObj.player_name : newPlayer;

      setTransitionMessage(`À vous de jouer, ${newPlayerName} !`);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateTurnTransition(true));
      });

      setTimeout(() => {
        setTransitionPhase("showing-text");
      }, freezeBoardDuration);

      setTimeout(() => {
        setTransitionPhase("none");
        setAnimateTurnTransition(false);
        setFrozenGameData(null);
      }, freezeBoardDuration + transitionDuration);
    },
    onRoundChange: (newRoundNumber, newGameState, previousGameState) => {
      console.log(`Transition vers le tour global n°${newRoundNumber}`);

      const syntheticState: GameDetail = {
        ...newGameState,
        current_player_username: previousGameState.current_player_username,
        current_turn_number: previousGameState.current_turn_number,
        current_dart_number: 4, // Permet d'afficher 3 fléchettes
        board_hits: {
          current_player:
            newGameState.board_hits.others.length > 0
              ? newGameState.board_hits.others
              : previousGameState.board_hits.current_player,
          others: [],
        },
      };

      setTransitionMessage(
        `Fin du tour ! On passe au tour n°${newRoundNumber}`,
      );
      setFrozenGameData(syntheticState);
      setTransitionPhase("showing-board");
      setIsRoundTransition(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateTurnTransition(true));
      });

      setTimeout(() => {
        setTransitionPhase("showing-text");
      }, freezeBoardDuration);

      setTimeout(() => {
        setTransitionPhase("none");
        setAnimateTurnTransition(false);
        setFrozenGameData(null);
      }, freezeBoardDuration + transitionDuration);
    },
    onGameFinished: (newGameState, previousGameState) => {
      console.log("Victoire enregistrée ! Fin de la partie.");

      const syntheticState: GameDetail = {
        ...newGameState,
        current_player_username: previousGameState.current_player_username,
        current_turn_number: previousGameState.current_turn_number,
        current_dart_number: 4,
        board_hits: {
          current_player:
            newGameState.board_hits.others.length > 0
              ? newGameState.board_hits.others
              : previousGameState.board_hits.current_player,
          others: [],
        },
      };

      setTransitionMessage("C'est fini !");
      setFrozenGameData(syntheticState);
      setTransitionPhase("showing-board");
      setIsRoundTransition(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateTurnTransition(true));
      });

      // On montre la cible 1.5s
      setTimeout(() => {
        setTransitionPhase("game-finished");
      }, freezeBoardDuration);

      // On affiche le message de fin, puis on redirige
      setTimeout(
        () => {
          router.refresh();
        },
        freezeBoardDuration + transitionDuration + 1000,
      ); // On laisse un peu plus de temps pour savourer
    },
  }); // We give the initial snapshot to the stream hook to hydrate the state immediately without waiting for the first stream update

  // Use frozen data if an animation is playing, otherwise live data
  const displayedData = frozenGameData || gameData!;

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

  // Index of the current player in the participations array
  const currentPlayerIndex =
    transitionPhase === "showing-text" || transitionPhase === "game-finished"
      ? -1
      : participations.findIndex(
          (p) => p.player_username === current_player_username,
        );

  // Participant Item in the list of players
  const listItem = (item: Participant, index: number) => {
    const { player_name, current_score, current_average } = item;

    // Number of darts thrown by the player
    const numberOfDarts = () => {
      // Find actual index ignoring transitionPhase to calculate darts correctly
      const actualPlayerIndex = participations.findIndex(
        (p) => p.player_username === current_player_username,
      );
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
  };

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
          {participations.map((p, index) => listItem(p, index))}
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
                    points={board_hits.current_player.map((i) =>
                      mapBackendToDartboard(i.x, i.y),
                    )}
                  />
                </div>

                <div className="block md:hidden">
                  <Dartboard
                    size={300}
                    points={board_hits.current_player.map((i) =>
                      mapBackendToDartboard(i.x, i.y),
                    )}
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
