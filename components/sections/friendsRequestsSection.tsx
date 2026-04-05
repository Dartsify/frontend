"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { calendarConvert } from "@/utils/dates";
import { Friend } from "@/utils/types";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/lib/fastapi/players";

const BUTTON_SCROLL_STEP = 2;

export default function FriendsRequestsSection({
  friends,
}: {
  friends: Friend[];
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // keep current index in state to manage button states and scroll position

  const [data, setData] = useState<Friend[]>(friends);

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

  const goPrev = () => scrollToIndex(currentIndex - BUTTON_SCROLL_STEP);
  const goNext = () => scrollToIndex(currentIndex + BUTTON_SCROLL_STEP);

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

  const handleRejectRequest = async (username: string) => {
    const res = rejectFriendRequest(username);

    const { error } = await res;

    if (error) {
      if (typeof error === "string") {
        alert(`Error rejecting friend request: ${error}`);
        return;
      }
      alert("Error rejecting friend request: Unknown error");
      return;
    }

    handleRemoveRequestFromData(username);
  };

  const handleAcceptRequest = async (username: string) => {
    const res = acceptFriendRequest(username);
    const { error } = await res;

    if (error) {
      if (typeof error === "string") {
        alert(`Error accepting friend request: ${error}`);
        return;
      }
      alert("Error accepting friend request: Unknown error");
      return;
    }

    handleRemoveRequestFromData(username);
  };

  const handleRemoveRequestFromData = (username: string) => {
    setData((prevData) =>
      prevData.filter((friend) => friend.username !== username),
    );
  };

  const listItem = (friend: Friend, index: number) => {
    const { username, name, creation_date } = friend;

    return (
      <li
        key={index}
        className="card shrink-0 basis-[calc((100%-1rem)/2)] snap-start list-none flex flex-col"
      >
        <div className="flex items-center justify-between">
          <h4 className="title">
            Demande de {name}
            {/* (@{username}) */}
          </h4>
          <p className="font-medium text-sm-2 text-foreground-soft">
            {calendarConvert(creation_date)}
          </p>
        </div>
        <p>
          Acceptez la demande de{" "}
          <b>
            {name} (@{username})
          </b>{" "}
          afin de l'ajouter à vos amis
        </p>

        <div className="flex flex-col flex-1">
          <div className="footer">
            <button
              onClick={() => handleRejectRequest(username)}
              type="button"
              className="btn btn-sm btn-destructive"
            >
              Refuser
            </button>
            <button
              onClick={() => handleAcceptRequest(username)}
              type="button"
              className="btn btn-sm btn-validate"
            >
              Accepter
            </button>
          </div>
        </div>
      </li>
    );
  };

  return (
    <section id="friends-requests-section" className="default-section">
      <div className="flex justify-between">
        <h2>Demandes d'amis</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`btn ${currentIndex === 0 ? "btn-invalid" : ""}`}
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Notification précédente"
          >
            {" "}
            <MoveLeft size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
          <button
            type="button"
            className={`btn ${currentIndex === data.length - 1 ? "btn-invalid" : ""}`}
            onClick={goNext}
            disabled={currentIndex === data.length - 1}
            aria-label="Notification suivante"
          >
            {" "}
            <MoveRight size={16} strokeWidth={2.5} className="cursor-pointer" />
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        friends.length === 0 ? (
          <p>Aucune demande d'ami en attente</p>
        ) : (
          <p>Toutes les demandes ont été traitées.</p>
        )
      ) : (
        <ul
          ref={listRef}
          onScroll={handleScroll}
          className="flex gap-4 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth overscroll-x-contain pb-4"
        >
          {data.map((item, index) => listItem(item, index))}
        </ul>
      )}
    </section>
  );
}
