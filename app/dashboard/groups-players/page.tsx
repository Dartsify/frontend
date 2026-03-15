import Link from "next/link";

export default function GroupsPayers() {
  return (
    <div>
      <h1>Groupes de Joueurs</h1>
      <Link href={"/groups-players/create"} className="text-blue-500 underline">
        Créer un groupe de joueurs
      </Link>
    </div>
  );
}
