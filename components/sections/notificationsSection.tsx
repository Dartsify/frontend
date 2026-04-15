"use client";

import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";

import { DashboardNotification } from "@/utils/types";
import { notificationType } from "@/utils/games";
import {
  rejectParticipation,
  validateParticipation,
} from "@/lib/fastapi/games";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/lib/fastapi/players";
import { calendarConvert } from "@/utils/dates";

const getNotificationTimestamp = (notification: DashboardNotification) => {
  const date =
    notification.type === "pending-game"
      ? notification.join_date
      : notification.request_date;

  return new Date(date).getTime();
};

export default function NotificationsSection({
  data: initialData,
}: {
  data: DashboardNotification[];
}) {
  // export default function NotificationsSection() {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // keep current index in state to manage button states and scroll position

  const [data, setData] = useState<DashboardNotification[]>(() =>
    [...initialData].sort(
      (a, b) => getNotificationTimestamp(b) - getNotificationTimestamp(a),
    ),
  );
  const hasNotifications = data.length > 0;
  const isPrevDisabled = !hasNotifications || currentIndex === 0;
  const isNextDisabled = !hasNotifications || currentIndex >= data.length - 1;

  const scrollToIndex = (nextIndex: number) => {
    // Scroll the list to the target index and update currentIndex state
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
    // Determine the closest item index based on current scroll position and update currentIndex state
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
    // Invoke at each scroll event, but debounce with requestAnimationFrame to avoid excessive updates
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

  useEffect(() => {
    // Keep index in bounds after removing notifications.
    setCurrentIndex((prev) => {
      if (data.length === 0) return 0;
      return Math.min(prev, data.length - 1);
    });
  }, [data.length]);

  const pendingGameAction = async (
    gameId: number,
    action: (game_id: number) => Promise<{ error?: unknown; data?: unknown }>,
  ) => {
    const res = await action(gameId);
    const { error } = res;

    if (error) {
      alert(
        typeof error === "string"
          ? error
          : "Une erreur est survenue. Veuillez réessayer.",
      );
      return;
    }

    setData((prev) =>
      prev.filter((i) => !(i.type === "pending-game" && i.game_id === gameId)),
    );
  };

  const friendRequestAction = async (
    username: string,
    action: (username: string) => Promise<{ error?: unknown; data?: unknown }>,
  ) => {
    const res = await action(username);
    const { error } = res;

    if (error) {
      alert(
        typeof error === "string"
          ? error
          : "Une erreur est survenue. Veuillez réessayer.",
      );
      return;
    }

    setData((prev) =>
      prev.filter(
        (i) => !(i.type === "friend-request" && i.username === username),
      ),
    );
  };

  const listItem = (item: DashboardNotification, index: number) => {
    const { type } = item;
    const { title, description, date, subtitle } = notificationType(item);

    // Specific footer content based on notification type
    const footer = () => {
      switch (type) {
        case "pending-game":
          return (
            <>
              <div className="footer">
                <button
                  onClick={() =>
                    pendingGameAction(item.game_id, rejectParticipation)
                  }
                  type="button"
                  className="btn btn-sm btn-destructive"
                >
                  Refuser
                </button>
                <button
                  onClick={() =>
                    pendingGameAction(item.game_id, validateParticipation)
                  }
                  type="button"
                  className="btn btn-sm btn-validate"
                >
                  Valider
                </button>
              </div>
            </>
          );
        case "friend-request":
          return (
            <>
              <div className="footer">
                <button
                  onClick={() =>
                    friendRequestAction(item.username, rejectFriendRequest)
                  }
                  type="button"
                  className="btn btn-sm btn-destructive"
                >
                  Refuser
                </button>
                <button
                  onClick={() =>
                    friendRequestAction(item.username, acceptFriendRequest)
                  }
                  type="button"
                  className="btn btn-sm btn-validate"
                >
                  Accepter
                </button>
              </div>
            </>
          );
      }
    };

    return (
      <li
        className="card flex-[0_0_100%] snap-start list-none flex flex-col"
        key={index}
      >
        <div className="flex items-center justify-between">
          <h4 className="title">{title}</h4>
          <p className="text-xs-2 text-foreground-soft font-medium -mt-1">
            {calendarConvert(date)}
          </p>
        </div>
        <p className="leading-4.5 mt-1.5 font-medium">{description}</p>
        <p className="leading-4.5 mt-2">{subtitle}</p>
        <div className="flex flex-col flex-1">{footer()}</div>
      </li>
      // <li
      //   className="card flex-[0_0_100%] snap-start list-none flex flex-col"
      //   key={index}
      // >
      //   {/* <div className="flex items-center justify-between -mb-0.5">
      //     <h4 className="title">{title}</h4>
      //     <p className="text-xs-2 text-foreground-soft font-medium -mt-1">
      //       {fromNow[0].toUpperCase() + fromNow.slice(1)}
      //     </p>
      //   </div> */}
      //   <h4 className="title">{title}</h4>
      //   <p className="text-sm-2 text-foreground-soft font-medium -mt-2">
      //     {fromNow[0].toUpperCase() + fromNow.slice(1)}
      //   </p>

      //   <p className="leading-5.5 mt-3">{description}</p>
      //   <p className="leading-5.5 mt-2">{subtitle}</p>
      //   <div className="flex flex-col flex-1">{footer()}</div>
      // </li>
    );
  };

  return (
    <section id="notif-card" className="default-section">
      <div className="flex justify-between">
        <h2>Notifications</h2>
        {/* Controllers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`btn ${isPrevDisabled ? "btn-invalid" : ""}`}
            onClick={goPrev}
            disabled={isPrevDisabled}
            aria-label="Notification précédente"
          >
            {" "}
            <MoveLeft size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
          <button
            type="button"
            className={`btn ${isNextDisabled ? "btn-invalid" : ""}`}
            onClick={goNext}
            disabled={isNextDisabled}
            aria-label="Notification suivante"
          >
            {" "}
            <MoveRight size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
        </div>
      </div>
      {data.length === 0 ? (
        <p>
          <i>Vous n'avez plus de notifications.</i>
        </p>
      ) : (
        <ul
          ref={listRef}
          onScroll={handleScroll}
          className="flex gap-4 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth overscroll-x-contain pb-4"
        >
          {/* Content */}
          {data.map((item, index) => listItem(item, index))}
        </ul>
      )}
    </section>
  );
}
