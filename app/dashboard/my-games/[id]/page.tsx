import { getGame } from "@/lib/fastapi/games";

import { statusBadge } from "@/utils/games";

import InProgressGame from "@/components/pages/inProgressGame";
import FinishedGameWrapper from "@/components/pages/finishedGameWrapper";

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

  const { text: statusText, color: statusColor } = statusBadge(status); // Status badge to show in the header

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <h1>Partie de {mode}</h1>
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <div className={`badge badge-neutral`}>
              <div className={`badge-disc ${statusColor}`} />
              <p>{statusText}</p>
            </div>
            {/* ID badge */}
            <div className={`badge badge-neutral`}>
              <p className="text-foreground-soft">{id}</p>
            </div>
          </div>
        </div>

        <main className="main-container">
          {/* If the the game's status is finished -> show the finished game wrapper (which gets more data and shows diff sections for a finished game) */}
          {status === "finished" && <FinishedGameWrapper {...data} />}
          {/* if the game's status is in_progress -> we show a in_progress game component */}
          {status === "in_progress" && <InProgressGame {...data} />}
        </main>
      </div>
    </>
  );
}
