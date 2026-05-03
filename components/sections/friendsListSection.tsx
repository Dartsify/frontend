"use client";

import { useState } from "react";
import Image from "next/image";
import { Swords, X } from "lucide-react";

import { Friend } from "@/utils/types";

import { useDialog } from "@/lib/hooks/useDialog";

import Dialog from "../dialogs/dialog";
import FriendDialog from "../dialogs/friendDialog";
import DeleteFriendConfirmationDialog from "../dialogs/deleteFriendConfirmationDialog";
import IconButton from "../buttons/actionButtons/iconButton";
import InlineIconButton from "../buttons/actionButtons/inlineIconButton";
import Link from "next/link";

export default function FriendsListSection({ friends }: { friends: Friend[] }) {
  const [friendData, setFriendData] = useState<Friend | null>(null);

  const dialogControls_friend = useDialog();
  const dialogControls_deleteConfirmation = useDialog();

  const handleShowControls = (friend: Friend) => {
    setFriendData(friend);
    dialogControls_friend.open();
  };

  const handleRemovePlayerConfirmation = (friend: Friend) => {
    setFriendData(friend);
    dialogControls_deleteConfirmation.open();
  };

  const listItem = (friend: Friend, index: number) => {
    const { name, username } = friend;

    return (
      <div
        onClick={() => handleShowControls(friend)}
        className="card bg-background-dark p-1.5 flex flex-row gap-3 items-center hover-anim-size-soft cursor-pointer"
        key={index}
      >
        <div className="rounded-xl relative w-10 h-10 md:w-15 md:h-15 overflow-hidden">
          <Image
            src={`https://avatars.githubusercontent.com/${username}`}
            alt="Avatar"
            objectFit="cover"
            fill
          />
        </div>

        <div className="flex-1">
          <h4 className="leading-none mb-0 font-medium">{name}</h4>
          <p className="text-sm-2 text-foreground-soft">@{username}</p>
        </div>

        <div className="">
          <button
            type="button"
            className="btn btn-xs btn-ghost btn-destructive-hover group"
            onClick={(event) => {
              // We need to stop the propagation of the click event to prevent the opening of the friend dialog (the action of the parent div) when we click on the remove button
              event.stopPropagation();
              handleRemovePlayerConfirmation(friend);
            }}
          >
            {" "}
            <X
              size={18}
              className="stroke-red-500 group-hover:stroke-foreground-light transition-colors duration-300"
            />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <section id="friends-list-section" className="default-section">
        <div className="flex justify-between items-center">
          <h2>Liste d'amis</h2>
          <Link
            href="/dashboard/friends/compare"
            type="button"
            className="btn btn-inline"
          >
            <Swords size={18} /> Se comparer
          </Link>
        </div>
        {friends.length === 0 ? (
          <p>
            <i>Ajoutez des amis pour les voir ici !</i>
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {friends.map((item, index) => listItem(item, index))}
          </ul>
        )}
      </section>

      <Dialog width="w-5/6 max-w-150" dialogControls={dialogControls_friend}>
        <FriendDialog
          friendData={friendData}
          dialogControls={dialogControls_friend}
        />
      </Dialog>

      <Dialog
        width="w-5/6 max-w-150"
        dialogControls={dialogControls_deleteConfirmation}
      >
        <DeleteFriendConfirmationDialog
          friendData={friendData}
          dialogControls={dialogControls_deleteConfirmation}
        />
      </Dialog>
    </>
  );
}
