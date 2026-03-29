"use client";

import { useEffect, useState } from "react";

import { startGameSseStream } from "@/lib/fastapi/games-stream";
import { getToken } from "@/lib/fastapi/auth";

export default function Stats() {
  const [dataChunks, setDataChunks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStream() {
      const token = await getToken();

      if (!token) {
        return setError("No auth token found");
      }

      try {
        await startGameSseStream({
          gameId: 8,
          token: token,
          signal: controller.signal,
          onOpen: () => {
            setIsConnected(true);
            setIsLoading(false);
          },
          onMessage: (message) => {
            setDataChunks((prev) => [...prev, message]);
          },
          onClose: () => {
            setIsConnected(false);
            setIsLoading(false);
          },
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setIsConnected(false);
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
      }
    }

    fetchStream();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div>
      <h1>Streaming Data</h1>
      {error && <p>Error: {error}</p>}
      {!error && <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>}
      {isLoading && dataChunks.length === 0 ? (
        <p>Loading stream data...</p>
      ) : isConnected && dataChunks.length === 0 ? (
        <p>Connected, waiting for first event...</p>
      ) : (
        <pre>{dataChunks.join("\n")}</pre>
      )}
    </div>
  );

  // return (
  //   <div>
  //     <h1>Statistiques</h1>

  //   </div>
  // );
}

// "use client";

// import { useDialog } from "../../../lib/hooks/useDialog";
// import Dialog from "@/components/dialogs/dialog";
// import LoginDialog from "@/components/dialogs/loginDialog";

// export default function Stats() {
//   const dialogControls = useDialog();

//   return (
//     <div>
//       <h1>Statistiques</h1>

//       <button onClick={dialogControls.toggleOpen} className="btn btn-primary">
//         Toggle Dialog
//       </button>

//       <Dialog width="w-150" dialogControls={dialogControls}>
//         <LoginDialog />
//       </Dialog>
//     </div>
//   );
// }
