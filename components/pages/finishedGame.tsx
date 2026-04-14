import { utcConvert } from "@/utils/dates";
import { GameDetail } from "@/utils/types";

export default function FinishedGame(game: GameDetail) {
  const {
    id,
    participations,
    mode,
    start_date,
    end_date,
    creation_date,
    target_location,
    target_name,
  } = game;

  return (
    <>
      <ul>
        <li>
          <b>Mode : </b> {mode}
        </li>
        <li>
          <b>Créé le : </b>{" "}
          {utcConvert(creation_date).format("DD/MM/YYYY HH:mm")}
        </li>
        <li>
          <b>Fin : </b>{" "}
          {end_date
            ? utcConvert(end_date).format("DD/MM/YYYY HH:mm")
            : "En cours"}
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
