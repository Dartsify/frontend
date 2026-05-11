import { GameDetail } from "@/utils/types";

export default function TargetCard({
  gameData,
}: {
  gameData: GameDetail | null;
}) {
  return (
    <div className="card">
      <h3>{gameData?.target_name || "Cible"}</h3>
      <p className="subtitle">Informations sur la cible sélectionnée.</p>

      <ul className="content">
        <li>
          <b>Identifiant :</b> {gameData?.target_id || "N/A"}
        </li>
        <li>
          <b>Lieu :</b> {gameData?.target_location || "N/A"}
        </li>
        <li>
          <b>Description :</b> {gameData?.target_description || "N/A"}
        </li>
      </ul>
    </div>
  );
}
