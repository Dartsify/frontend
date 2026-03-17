"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import { title } from "process";

import moment from "moment";
import "moment/locale/fr";

const data: { title: string; description: string; date: Date; type: string }[] =
  [
    {
      title: "Nouvelle partie de groupe",
      date: new Date("2026-03-01T14:48:00"),
      description:
        "Alexandre (alexboss) a créé une nouvelle partie de Cricket dans le groupe Test.",
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
    <div className="card" key={index}>
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
    </div>
  );
};

export default function NotificationsSection() {
  return (
    <section id="notif-card" className="default-section">
      <div className="flex justify-between">
        <h2>Notifications</h2>
        {/* Controllers */}
        <div className="flex items-center gap-1">
          <button type="button" className="btn">
            {" "}
            <MoveLeft size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
          <button type="button" className="btn">
            {" "}
            <MoveRight size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
        </div>
      </div>
      <div>
        {/* Content */}
        {data.map((item, index) => listItem(item, index))}
      </div>
    </section>
  );
}
