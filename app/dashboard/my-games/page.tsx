import CurrentGamesSection from "@/components/sections/currentGamesSection";
import MyGamesSection from "@/components/sections/currentGamesSection";
import FinishedGamesSection from "@/components/sections/finishedGamesSection";
import { getGames } from "@/lib/fastapi/games";

export default async function MyGames() {
  const currentGames = await getGames("waiting");
  const finishedGames = await getGames("finished");

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
        <FinishedGamesSection games={finishedData} />
      </main>
    </div>
  );
}

{
  /* <button className="group bg-foreground text-foreground-light flex items-center relative cursor-pointer py-2 px-3 hover:pr-8 hover:scale-110 transition-all duration-500">
  Texte du bouton
  <Play
    size={16}
    className="rotate-180 opacity-0 group-hover:opacity-100 group-hover:rotate-360 group-hover:right-3 transition-all duration-500 absolute right-3 ease-out"
  />
</button>; */
}
