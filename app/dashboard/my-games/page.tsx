import CurrentGamesSection from "@/components/sections/currentGamesSection";
import FinishedGamesSection from "@/components/sections/finishedGamesSection";

import { getGames } from "@/lib/fastapi/games";

// TODO : add the good title in the navbar header
// TODO : edit the already finished game page

export default async function MyGames() {
  const currentGames = await getGames({ status: ["waiting", "in_progress"] });
  const finishedGames = await getGames({ status: ["finished"] });

  const { data: currentData, error: currentError } = currentGames;
  const { data: finishedData, error: finishedError } = finishedGames;

  if (currentError || !currentData) {
    if (typeof currentError === "string") {
      return <div>Error: {currentError}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  if (finishedError || !finishedData) {
    if (typeof finishedError === "string") {
      return <div>Error: {finishedError}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  return (
    <div>
      <h1>Mes Parties</h1>

      <main className="main-container">
        <CurrentGamesSection games={currentData} />
        {/* <FinishedGamesSection games={finishedData} /> */}
        <FinishedGamesSection games={finishedData} />
      </main>
    </div>
  );
}
