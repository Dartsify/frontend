"use client";

import { MoveLeft, MoveRight } from "lucide-react";

export default function NotificationsSection() {
  return (
    <section id="welcome-card" className="default-section">
      <div className="flex justify-between">
        <h2>Notifications</h2>
        {/* Controllers */}
        <div>
          <button type="button" className="btn">
            <MoveLeft size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
          <button type="button" className="btn">
            <MoveRight size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
        </div>
      </div>
      <div>
        {/* Content */}
        <div className="card">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ad
            laboriosam dolore tempora expedita fugit corrupti aspernatur
            deserunt eaque at recusandae molestias, cum cupiditate
            exercitationem eveniet veritatis laudantium consectetur similique.
          </p>
        </div>
      </div>
    </section>
  );
}
