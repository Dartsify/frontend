import { getGame } from "@/lib/fastapi/games";

import { statusBadge } from "@/utils/games";

import FinishedGame from "@/components/pages/finishedGame";
import InProgressGame from "@/components/pages/inProgressGame";

export default async function Game({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const game = await getGame(parseInt(id));

  const { data, error } = game;

  if (error || !data) {
    if (typeof error === "string") {
      return <div>Error: {error}</div>;
    }
    return <div>Error</div>;
  }

  const { status, mode } = data;

  const { text: statusText, color: statusColor } = statusBadge(status);

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h1>Partie de {mode}</h1>
          <div className={`badge badge-neutral`}>
            <div className={`badge-disc ${statusColor}`} />
            <p>{statusText}</p>
          </div>
        </div>

        <main className="main-container">
          {status === "finished" && <FinishedGame {...data} />}
          {status === "in_progress" && <InProgressGame {...data} />}
        </main>
      </div>
    </>
  );
}
