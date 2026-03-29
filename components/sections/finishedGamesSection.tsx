import Link from "next/link";

import { Game } from "@/utils/types";
import { utcConvert } from "@/utils/dates";

const tableFields = ["Lieu", "Cible", "Mode", "Gagnant", "Joueurs", "Date"];

const listItem = async (game: Game, index: number) => {
  // const { id, status, target_id, start_date, participants } = game;
  const { id, status, target_id, mode, start_date } = game;

  // const { data, error } = await getGame(id);

  // if (error || !data) {
  //   if (typeof error === "string") {
  //     return <div>Error: {error}</div>;
  //   }
  //   return <div>Error: Erreur Inconnue</div>;
  // }

  // const {
  //   status,
  //   target_id,
  //   participations,
  //   target_description,
  //   target_location,
  //   target_name,
  //   start_date,
  //   mode,
  // } = data;

  // Return the name of the host of the game
  // const gameHostName = () => {
  //   const host = participations.find((p) => p.is_host == true);

  //   return host
  //     ? { name: host.player_name, username: host.player_username }
  //     : { name: "Inconnu", username: "N/A" };
  // };

  // const { name: hostName, username: hostUsername } = gameHostName();

  return (
    <li key={index}>
      <Link
        className={`table-line ${index % 2 === 0 ? "bg-background" : "bg-background-dark"}`}
        href={`/dashboard/my-games/${id}`}
      >
        <p>Chez Cabu, Gerpinnes</p>
        <p>Cible Bar</p>
        {/* <p>{id}</p> */}
        <p>{mode}</p>
        <p>Vous</p>
        <p>{1}</p>
        <p>{utcConvert(start_date).format("DD/MM/YYYY HH:mm")}</p>
      </Link>
    </li>
  );
};

export default async function FinishedGamesSection({
  games,
}: {
  games: Game[];
}) {
  return (
    <section id="my-games-section" className="default-section">
      <h2>Parties terminées</h2>
      {games.length === 0 ? (
        <p>Aucune partie</p>
      ) : (
        <>
          {/* Specify the number of columns in the table -> here we want 6 columns with diff sizes (according to the field content) */}
          {/* By default, I specified 6 columns with fix size */}
          <ul className="table [&_.table-line]:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.4fr)]">
            {/* First elem is the header (with the fields) */}
            <li key={-1} className="table-header table-line">
              {tableFields.map((field, index) => (
                <p key={index}>{field}</p>
              ))}
            </li>
            {games.map((game, index) => listItem(game, index))}
          </ul>
        </>
      )}
    </section>
  );
}
