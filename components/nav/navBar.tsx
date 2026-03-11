import { Play, PlayCircle } from "lucide-react";
import LogoBanner from "../logoBanner";
import Link from "next/link";

export default function NavBar() {
  return (
    <div className="flex flex-col px-5 py-5 h-screen">
      <LogoBanner />

      <div>
        <b className="text-text-secondary">Jouer</b>
        <ul>
          <li className="flex gap-2 items-center">
            <Link href={"/new-game"}>
              <Play size={15} />
              Nouvelle Partie
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
