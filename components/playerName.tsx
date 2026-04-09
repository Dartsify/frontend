"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy } from "lucide-react";
import Image from "next/image";

import { Participant } from "@/utils/types";
import { userIsGuest } from "@/utils/users";
import FriendWrapper from "./dialogs/friendWrapper";

// Component to display the name of a player with some controls when we hover the player's name or click on it
export default function PlayerName({
  player,
  myUsername,
  showUsername = true,
}: {
  player: Participant;
  myUsername: string;
  showUsername?: boolean; // Option to show or hide the username, useful for the players card where we already show the username in the text below the name
}) {
  // Controls visibility is managed with state instead of pure CSS hover,
  // so we can keep it open briefly when the pointer leaves.
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(false);

  const [showFriendDialog, setShowFriendDialog] = useState<boolean>(false); // State to show the friend dialog when we click on the player's name

  // Stores the pending close timeout to cancel it when the pointer comes back.
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { player_name, player_username } = player; // Informations of the pointed player

  const isMe = player_username === myUsername; // User is pointing himself

  const showUserControls = !isMe && !userIsGuest(player_username); // Show controls only if it's not me and not a guest

  //   Show controls when user clicks on a user
  const handleShowUserControls = () => {
    alert(
      `Vous pourrez bientôt avoir directement ici des infos sur ${player_name} (@${player_username}) !`,
    );
  };

  // Opens controls immediately and cancels any pending close.
  const openControls = () => {
    if (!showUserControls) return;

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setIsControlsVisible(true);
  };

  // Starts a delayed close, creating a small grace period for hover gaps while moving the pointer from the text to the controls panel.
  const closeControlsWithDelay = () => {
    if (!showUserControls) return;

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      setShowFriendDialog(false);
      setIsControlsVisible(false);
      closeTimeoutRef.current = null;
    }, 80);
  };

  // Cleanup timeout on unmount to avoid updating state after component removal.
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        className={`group relative`}
        onMouseEnter={openControls}
        onMouseLeave={closeControlsWithDelay}
      >
        <p
          className={`${showUserControls && "transition-colors duration-300 ease-out cursor-pointer"} ${isControlsVisible && "text-brand"}`}
          // onClick={() => (showUserControls ? handleShowUserControls() : null)}
        >
          <b className="">{player_name}</b>
          {isMe && " (Vous)"}
          {showUsername && (
            <>
              ({userIsGuest(player_username) ? "Invité" : "@" + player_username}
              )
            </>
          )}
        </p>

        {/* User controls */}
        {showUserControls && (
          <div
            // Visual open/close animation is driven by state to stay in sync with the delayed hover close behavior.
            className={`z-100 absolute flex gap-3 items-center cursor-pointer rounded-lg top-6 -left-2 bg-background px-1.5 py-1.5 border border-border-2 shadow-xs transition-all duration-250 ease-out ${
              isControlsVisible
                ? "opacity-100 visible translate-y-0 scale-100"
                : "opacity-0 invisible translate-y-1 scale-95 pointer-events-none"
            }`}
            onMouseEnter={openControls}
            onMouseLeave={closeControlsWithDelay}
            onClick={() => setShowFriendDialog(true)}
          >
            <div className="rounded-md relative w-7 h-7 md:w-10 md:h-10 overflow-hidden">
              <Image
                src={`https://avatars.githubusercontent.com/${player_username}`}
                alt="Avatar"
                objectFit="cover"
                fill
              />
            </div>

            <div>
              <h4 className="leading-none font-medium">{player_name}</h4>
              <p className="text-sm-2 text-foreground-soft -my-0.5">
                @{player_username}
              </p>
            </div>

            {/* <div className="btn btn-xs btn-brand-anim ml-4 cursor-pointer">
            <UserPlus size={16} strokeWidth={2.5} />
          </div> */}
            <div className="ml-4 flex gap-0.5 items-center">
              <p className="text-yellow-500 font-bold">{player_name.length}</p>{" "}
              {/* TODO: Replace with actual victories count */}
              <Trophy size={16} className="text-yellow-500" strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>
      {/* Show friend dialog when we click on the player's name */}
      {showFriendDialog && <FriendWrapper friendData={player} />}{" "}
    </>
  );
}
