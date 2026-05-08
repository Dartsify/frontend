import ErrorPageText from "@/components/errorPageText";
import CurrentGamesSection from "@/components/sections/currentGamesSection";
import FinishedGamesSection from "@/components/sections/finishedGamesSection";

import { getGames } from "@/lib/fastapi/games";

// TODO : add the good title in the navbar header

export default async function MyGames() {
  const currentGames = await getGames({ status: ["waiting", "in_progress"] });
  const finishedGames = await getGames({ status: ["finished"] });

  const { data: currentData, error: currentError } = currentGames;
  const { data: finishedData, error: finishedError } = finishedGames;

  if (currentError || !currentData) {
    if (typeof currentError === "string") {
      return ErrorPageText(currentError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  if (finishedError || !finishedData) {
    if (typeof finishedError === "string") {
      return ErrorPageText(finishedError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  return (
    <div>
      {/* <h1>Mes Parties</h1> */}
      <div className="flex justify-between items-center">
        <h1 className="mb-0">Mes Parties</h1>
      </div>

      <main className="main-container">
        <CurrentGamesSection games={currentData} />
        <FinishedGamesSection games={finishedData} />
      </main>
    </div>
  );
}
