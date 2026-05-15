"use client";

import { CircleSlash2 } from "lucide-react";

import Dartboard from "../dartboard";
import LastThreeScores from "../lastThreeScores";

import { GameDetail, Participant } from "@/utils/types";

import { useGameStream } from "@/lib/hooks/useGameStream";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mapBackendToDartboard } from "@/utils/games";
import DefaultInProgressGame from "./games/defaultInProgressGame";
import CustomInProgressGame from "./games/customInProgressGame";

const transitionDuration = 2500; // Time we show the text in ms
const freezeBoardDuration = 1500; // Time we show the board before text in ms

export default function InProgressGame(game: GameDetail) {
  const router = useRouter();
  const [transitionPhase, setTransitionPhase] = useState<
    "none" | "showing-board" | "showing-text" | "game-finished"
  >("none");
  const [isRoundTransition, setIsRoundTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState("");

  const [animateTurnTransition, setAnimateTurnTransition] = useState(false);
  const [frozenGameData, setFrozenGameData] = useState<GameDetail | null>(null);

  // Hook for streaming game data
  const {
    gameData,
    loading: loadingGameData,
    error: gameError,
  } = useGameStream(game.id, game, {
    onTurnChange: (newPlayer, oldPlayer, newGameState, previousGameState) => {
      console.log(`C'est au tour de ${newPlayer} (précédemment ${oldPlayer})`);

      // We freeze the screen on the previous player, but WITH their newly scored points (newGameState).
      // We use 'previousGameState' to keep the visual focus on the old player.
      const syntheticState: GameDetail = {
        ...newGameState,
        current_player_username: oldPlayer,
        current_turn_number: previousGameState.current_turn_number,
        current_dart_number: 4, // Enable to show that 3 darts have been thrown in numberOfDarts
        board_hits: {
          current_player:
            newGameState.board_hits.others.length > 0
              ? newGameState.board_hits.others // If the backend has already moved the darts to 'others', we show them, otherwise we keep showing at least the first 2 darts of the previous player to avoid an empty board and a too brutal transition
              : previousGameState.board_hits.current_player,
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
        current_dart_number: 4, // Enable to show 3 darts
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

      // We show the dart 1.5s before the text to let the players see the final hit that won the game and savor the victory a bit more
      setTimeout(() => {
        setTransitionPhase("game-finished");
      }, freezeBoardDuration);

      // We show the end message, then we redirect
      setTimeout(
        () => {
          router.refresh();
        },
        freezeBoardDuration + transitionDuration + 1000,
      ); // We leave a bit more time to savor the moment
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

  // Find actual index ignoring transitionPhase to calculate darts correctly
  const actualPlayerIndex = participations.findIndex(
    (p) => p.player_username === current_player_username,
  );

  if (mode === "custom-dartsify")
    return (
      <CustomInProgressGame
        currentPlayerIndex={currentPlayerIndex}
        actualPlayerIndex={actualPlayerIndex}
        displayedData={displayedData}
        transitionPhase={transitionPhase}
        isRoundTransition={isRoundTransition}
        transitionMessage={transitionMessage}
        animateTurnTransition={animateTurnTransition}
        transitionDuration={transitionDuration}
        freezeBoardDuration={freezeBoardDuration}
      />
    );

  return (
    <DefaultInProgressGame
      currentPlayerIndex={currentPlayerIndex}
      actualPlayerIndex={actualPlayerIndex}
      displayedData={displayedData}
      transitionPhase={transitionPhase}
      isRoundTransition={isRoundTransition}
      transitionMessage={transitionMessage}
      animateTurnTransition={animateTurnTransition}
      transitionDuration={transitionDuration}
      freezeBoardDuration={freezeBoardDuration}
    />
  );
}
