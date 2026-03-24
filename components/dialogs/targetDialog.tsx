"use client";

import { DialogControls } from "@/utils/types";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { OtpInput } from "../otpInput";
import { useContext, useState } from "react";
import { useOtpInput } from "@/lib/hooks/useOtpInput";
import { UserDataContext } from "@/app/dashboard/providers";

export default function TargetDialog({
  dialogControls,
}: {
  dialogControls: DialogControls;
}) {
  const router = useRouter();

  const [showInput, setShowInput] = useState(true);

  const userDataContext = useContext(UserDataContext);

  if (!userDataContext) return <div>Loading...</div>;

  const { userData } = userDataContext;

  const otpInput = useOtpInput();
  const { otp, setOtp } = otpInput;

  const handleCloseDialog = () => {
    dialogControls.close();
    router.push("/dashboard/");
  };

  const handleCancelDialog = () => {
    // if (userData) {
    //   dialogControls.close();
    //   router.push("/dashboard/");
    // } else {
    //   dialogControls.close();
    // }
    dialogControls.close();
    router.push("/dashboard/");
  };

  return (
    <div className="dialog">
      <div className="header">
        <h2>Connectez-vous à une cible Dartsify</h2>
        <div className="btn btn-sm" onClick={handleCloseDialog}>
          <X size={22} />
        </div>
      </div>
      <p className="text-foreground-soft">
        Pour commencer une partie, vous devez être connecté à une cible
        Dartsify. Si vous en avez pas, rendez-vous dans un bar partenaire ou
        achetez-en une sur notre site.
      </p>
      <p className="mt-2">
        Entrez le code à 6 chiffres affiché sur votre cible, ou{" "}
        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={() => setShowInput(false)}
        >
          utilisez la caméra et scannez le QR Code
        </span>{" "}
        pour une connexion plus rapide.
      </p>

      <div className="flex items-center justify-center mt-8">
        <OtpInput otp={otp} setOtp={setOtp} />
      </div>

      <div className="footer">
        <button
          className={`btn btn-destructive-soft`}
          type="submit"
          onClick={handleCancelDialog}
        >
          Annuler
        </button>
        <button
          className={`btn btn-brand ${otp.includes("") && "btn-invalid"}`}
          type="submit"
          //   onClick={handle}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
