import { utcConvert } from "@/utils/dates";
import { GameDetail } from "@/utils/types";

export default function FinishedGame(game: GameDetail) {
  const { id, participations, mode, start_date, target_location, target_name } =
    game;

  return (
    <>
      <ul>
        <li>
          <b>Mode : </b> {mode}
        </li>
        <li>
          <b>Créé le : </b> {utcConvert(start_date).format("DD/MM/YYYY HH:mm")}
        </li>
        <li>
          <b>Localisation : </b> {target_location || "Inconnu"}
        </li>
        <li>
          <b>Cible : </b> {target_name || "Inconnue"}
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
    </>
  );
}
