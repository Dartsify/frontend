import MyGamesSection from "@/components/sections/myGamesSection";
import { getGames } from "@/lib/fastapi/games";

export default async function MyGames() {
  const myGames = await getGames();

  const { data, error } = myGames;

  if (error || !data) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Mes Parties</h1>

      <main className="main-container">
        <MyGamesSection myGames={data} />
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
