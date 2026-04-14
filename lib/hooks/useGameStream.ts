"use client";

import { useState, useEffect } from "react";

import { startGameSseStream } from "@/lib/fastapi/games-stream"; // ton helper
import { getGame } from "@/lib/fastapi/games";

import { GameDetail } from "@/utils/types";

// Stream the data of the game to be sure to have the most up-to-date data of the game (especially for the players list in the lobby)
// We call this hook stream in the NewGame Page, and we pass the gameId to start the stream for this game.
export function useGameStream(
  gameId: number | undefined,
  snapshot?: GameDetail,
) {
  const [gameData, setGameData] = useState<GameDetail | null>(
    snapshot && gameId ? { ...snapshot, id: gameId } : null,
  ); // We directly init the state with the given snapshot (if exists)
  // const [gameData, setGameData] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(snapshot ? false : true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // const [frozenData, setFrozenData] = useState<GameDetail | null>(null); // Set here the data we want to keep frozen

  // gameId is set after successfully creating or joining a game in the TargetDialog (from NewGame Page)
  //  -> We want to get the data of the party and start the stream
  useEffect(() => {
    // If we don't have a gameId, we can't start the stream, so we return early.
    // if (!gameId) return;

    console.log("gameId ok :", gameId);

    // AbortController in order to stop the stream when the component unmounts or when the gameId changes
    let controller: AbortController | null = null;

    // Init the stream
    const initStream = async () => {
      if (!gameId) {
        setLoading(false);
        return;
      }

      console.log("Starting game stream for gameId:", gameId);
      controller = new AbortController();

      try {
        // 1) Hydrate initial state once (snapshot) before listening to live updates.
        if (!snapshot) {
          //   Set loading to true and reset error before starting the stream
          setLoading(true);
          setError(null);

          const { data: snapshot, error: snapshotError } =
            await getGame(gameId);

          if (snapshotError || !snapshot) {
            // throw new Error(
            // typeof snapshotError === "string"
            //   ? snapshotError
            //   : "Failed to load initial game data",
            // );
            // throw new Error show an error in next js dev tools !
            console.error(
              typeof snapshotError === "string"
                ? snapshotError
                : "Failed to load initial game data",
            );
            return;
          }

          // const isFriendField = snapshot.participations.map((p) => p.is_friend);

          // console.log("isFriendField: ", isFriendField);

          // setFrozenData({ participations: isFriendField });
          setGameData({ ...snapshot, id: gameId });

          setLoading(false);
        }

        console.log("Initial game data loaded:", snapshot);

        // 2) Start SSE for live updates.
        await startGameSseStream({
          gameId,
          signal: controller.signal,
          onOpen: () => {
            setIsConnected(true);
          },
          onMessage: (message) => {
            // Parse et merge les updates (ex: JSON.parse(message) et setGameData)
            try {
              const update = JSON.parse(message);
              console.log("Game update:", update);
              const { event, game_state } = update;
              if (event === "GAME_UPDATED") {
                // Event GAME_UPDATED means the data has been updated, so we update the current data
                setGameData({ ...game_state, id: gameId }); // We don't merge, we replace the whole data (no sense to keep the prev one)
              }
            } catch {
              console.error("Parse error:", message);
            }
          },
          onClose: () => {
            setIsConnected(false);
            setLoading(false);
          },
        });
      } catch (err) {
        // console.error("Stream error:", err);
        // console.log("Stream error:", err);
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
        setIsConnected(false);
      }
    };

    initStream();

    return () => {
      controller?.abort();
    };
  }, [gameId]); // Dépendance : relance si gameId change

  return { gameData, loading, error, isConnected };
}
