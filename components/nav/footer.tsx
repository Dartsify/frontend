import { routes } from "@/utils/routes";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background-dark w-full border-t border-border pt-8 pb-8 px-4 mt-15 flex flex-col lg:flex-row items-start lg:items-center lg:justify-between">
      <p className="text-background text-7xl md:text-9xl">
        <b className="brand-title-outline">Dartsify</b>
        <span className="text-sm opacity-15">®️</span>
      </p>

      <ul className="text-foreground-soft mt-10 grid grid-cols-2 gap-x-5 gap-y-1">
        {Object.keys(routes)
          .filter((i) => i.includes("dashboard"))
          .map((segment, index) => (
            <li
              className="hover-anim hover:text-foreground transition-[color] max-w-35 leading-5"
              key={index}
            >
              • <Link href={segment}>{routes[segment]}</Link>
            </li>
          ))}
      </ul>
    </footer>
  );
}
