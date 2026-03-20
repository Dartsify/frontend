"use client";

import Login from "@/app/dashboard/login/page";
import { ShowLoginPanelContext } from "@/app/dashboard/providers";
import { User } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function LoginGate({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | boolean;
  // User if User Data,
  // False if not authenticated
}) {
  const isAuth = !!user;

  const router = useRouter();

  const showLoginPanelContext = useContext(ShowLoginPanelContext);
  if (!showLoginPanelContext) return <div>Loading...</div>;
  const { showLoginPanel, setShowLoginPanel } = showLoginPanelContext;

  useEffect(() => {
    if (!isAuth) {
      router.replace("/dashboard/new-game");
    }
  }, [isAuth, router]);

  if (!isAuth) {
    return (
      <div className="flex justify-center">
        <div className={`flex-1 ${showLoginPanel && "opacity-50"}`}>
          {children}
        </div>
        {/* <div className="self-center"> */}
        {showLoginPanel && <Login />}
        {/* </div> */}
      </div>
    );
  }

  return children;
}
