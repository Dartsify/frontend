import { calendarConvert } from "@/utils/dates";
import { GameDetail } from "@/utils/types";

export default function InfosCard({ gameData }: { gameData: GameDetail }) {
  const { id, start_date, end_date, creation_date } = gameData;
  return (
    <div className="card">
      <h3>Informations</h3>
      <p className="subtitle">Informations sur la partie.</p>

      <ul className="content">
        <li>
          <b>Identifiant :</b> {id}
        </li>
        <li>
          <b>Date de création :</b> {calendarConvert(creation_date)}
        </li>
        <li>
          <b>Date de début :</b> {calendarConvert(start_date)}
        </li>
        <li>
          <b>Date de fin :</b> {end_date ? calendarConvert(end_date) : "N/A"}
        </li>
      </ul>
    </div>
  );
}
