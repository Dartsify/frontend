import { routes } from "@/utils/routes";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="gradient-bg-light w-full bg-background-dark border-t border-border pt-10 pb-5 px-4 mt-15">
      <h3 className="font-semibold">Footer de la page</h3>
      Liste des pages :
      <ul>
        {Object.keys(routes).map((segment, index) => (
          <li className="hover-anim" key={index}>
            <Link href={segment}>{routes[segment]}</Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
