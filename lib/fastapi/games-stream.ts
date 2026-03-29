import { StartGameStreamOptions } from "@/utils/types";

export const startGameSseStream = async ({
  gameId,
  token,
  signal,
  onOpen,
  onMessage,
  onClose,
}: StartGameStreamOptions) => {
  try {
    const res = await fetch(
      `http://100.117.205.35:8000/games/${gameId}/stream`,
      {
        method: "GET",
        headers: {
          accept: "text/event-stream",
          authorization: `Bearer ${token}`,
        },
        signal,
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    if (!res.body) {
      throw new Error("Response body is null");
    }

    onOpen?.();

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      events.forEach((event) => {
        const lines = event.split("\n");
        const dataLines = lines
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trim());

        if (dataLines.length > 0) {
          onMessage(dataLines.join("\n"));
        }
      });
    }

    onClose?.();
  } catch (error) {
    throw error;
  }
};
