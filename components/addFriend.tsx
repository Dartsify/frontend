"use client";

import { Plus } from "lucide-react";
import IconButton from "./buttons/actionButtons/iconButton";
import Dialog from "./dialogs/dialog";
import { useDialog } from "@/lib/hooks/useDialog";
import AddFriendDialog from "./dialogs/addFriendDialog";

export default function AddFriend() {
  const dialogControls = useDialog();

  const { open, toggleOpen } = dialogControls;

  return (
    <>
      <IconButton
        title="Ajouter un ami"
        icon={<Plus size={16} />}
        onClick={toggleOpen}
      />

      <Dialog width="w-5/6 max-w-150" dialogControls={dialogControls}>
        <AddFriendDialog dialogControls={dialogControls} />
      </Dialog>
    </>
  );
}
