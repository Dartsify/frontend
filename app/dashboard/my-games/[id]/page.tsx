import { getGame } from "@/lib/fastapi/games";
import { utcConvert } from "@/utils/dates";

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

  const { participations, mode, start_date } = data;

  return (
    <div>
      <header>
        <h1>Game {id}</h1>
      </header>
      <main className="main-container">
        <ul>
          <li>
            <b>Mode : </b> {mode}
          </li>
          <li>
            <b>Créé le : </b>{" "}
            {utcConvert(start_date).format("DD/MM/YYYY HH:mm")}
          </li>
        </ul>

        <section className="default-section">
          <div className="card">
            <h4 className="title">Joueurs</h4>
            <ul>
              {participations.map((player) => (
                <li key={player.player_username}>{player.player_username}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
