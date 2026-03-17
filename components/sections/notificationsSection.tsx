"use client";

import { useEffect, useRef, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";

import moment from "moment";
import "moment/locale/fr";

const data: { title: string; description: string; date: Date; type: string }[] =
  [
    {
      title: "Nouvelle partie de groupe",
      date: new Date("2026-03-01T14:48:00"),
      description:
        "Alexandre (alexboss) a créé une nouvelle partie de Cricket dans le groupe Test à Chez Cabu.",
      type: "new-game",
    },
    {
      title: "Nouvelle partie de groupe",
      date: new Date("2026-02-01T14:48:00"),
      description:
        "Adrien (adri1) a créé une nouvelle partie de 501 dans le groupe Test à Kickoff.",
      type: "new-game",
    },
  ];

const listItem = (
  item: { title: string; description: string; date: Date; type: string },
  index: number,
) => {
  const { title, description, type } = item;

  const fromNow = moment(item.date).fromNow();

  return (
    <li className="card flex-[0_0_100%] snap-start list-none" key={index}>
      <div className="flex items-center justify-between">
        <h4 className="title">{title}</h4>
        <p className="text-xs text-foreground-soft font-bold">
          {fromNow[0].toUpperCase() + fromNow.slice(1)}
        </p>
      </div>
      <p>{description}</p>
      {type == "new-game" && (
        <div className="flex flex-col">
          <p className="">
            Confirmez votre présence afin d'ajouter cette partie à vos
            statistiques !
          </p>

          <div className="flex gap-2 self-end">
            <button className="btn btn-destructive">Refuser</button>
            <button className="btn btn-validate">Valider</button>
          </div>
        </div>
      )}
    </li>
  );
};

export default function NotificationsSection() {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (nextIndex: number) => {
    const list = listRef.current;
    if (!list) return;

    const items = list.querySelectorAll("li");
    const boundedIndex = Math.max(0, Math.min(nextIndex, items.length - 1));
    const target = items[boundedIndex] as HTMLElement | undefined;

    if (!target) return;

    list.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    setCurrentIndex(boundedIndex);
  };

  const goPrev = () => scrollToIndex(currentIndex - 1);
  const goNext = () => scrollToIndex(currentIndex + 1);

  const syncIndexFromScroll = () => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.querySelectorAll("li")) as HTMLElement[];
    if (!items.length) return;

    const currentLeft = list.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - currentLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setCurrentIndex((prev) => (prev === closestIndex ? prev : closestIndex));
  };

  const handleScroll = () => {
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
    }

    scrollRafRef.current = requestAnimationFrame(() => {
      syncIndexFromScroll();
      scrollRafRef.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  return (
    <section id="notif-card" className="default-section">
      <div className="flex justify-between">
        <h2>Notifications</h2>
        {/* Controllers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`btn ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Notification précédente"
          >
            {" "}
            <MoveLeft size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
          <button
            type="button"
            className={`btn ${currentIndex === data.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={goNext}
            disabled={currentIndex === data.length - 1}
            aria-label="Notification suivante"
          >
            {" "}
            <MoveRight size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
        </div>
      </div>
      <ul
        ref={listRef}
        onScroll={handleScroll}
        className="flex gap-4 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth overscroll-x-contain pb-4"
      >
        {/* Content */}
        {data.map((item, index) => listItem(item, index))}
      </ul>
    </section>
  );
}
