"use client";

import { DialogControls } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserDataContext } from "@/app/dashboard/providers";
import { X } from "lucide-react";

import LoginDialog from "./loginDialog";

export default function NameInputDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const userDataContext = useContext(UserDataContext);

  if (!userDataContext) return <div>Loading...</div>;

  const { userData } = userDataContext;

  return (
    <div className="dialog">
      <div className="header">
        <h2>Choisissez votre nom pour rejoindre la partie</h2>
        <div className="btn btn-sm" onClick={dialogControls.close}>
          <X size={22} />
        </div>
      </div>

      <div className="footer">
        <button
          className={`btn btn-destructive-soft`}
          type="submit"
          onClick={dialogControls.close}
        >
          Retour
        </button>
        <button
          className={`btn btn-brand`}
          type="submit"
          onClick={dialogControls.close}
        >
          Rejoindre
        </button>
      </div>
    </div>
  );
}
