import { routes } from "@/utils/routes";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background-dark w-full border-t border-border pt-8 pb-8 px-4 mt-15">
      <p className="text-background text-9xl">
        <b className="brand-title-outline">Dartsify</b>
        <span className="text-sm opacity-15">®️</span>
      </p>

      <p className="text-foreground-soft mt-10">
        {Object.keys(routes)
          .filter((i) => i.includes("dashboard"))
          .map((segment, index) => (
            <span
              className="hover-anim hover:text-foreground transition-[color]"
              key={index}
            >
              <Link href={segment}>{routes[segment]}</Link>
              {index < Object.keys(routes).length - 2 && (
                <span className="mx-2">•</span>
              )}
            </span>
          ))}
      </p>
    </footer>
  );
}
