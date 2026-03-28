import { GameDetail } from "@/utils/types";

export default function TargetCard({
  gameData,
}: {
  gameData: GameDetail | null;
}) {
  return (
    <div className="card">
      <h4 className="title">{gameData?.target_name || "Cible"}</h4>
      <ul>
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
