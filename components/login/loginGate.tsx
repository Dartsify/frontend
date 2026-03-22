"use client";

import Login from "@/app/dashboard/login/page";
import { ShowLoginPanelContext } from "@/app/dashboard/providers";
import { User } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";

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

  const veil = useRef<HTMLDivElement | null>(null);

  const showLoginPanelContext = useContext(ShowLoginPanelContext);
  if (!showLoginPanelContext) return <div>Loading...</div>;
  const { showLoginPanel, setShowLoginPanel } = showLoginPanelContext;

  useEffect(() => {
    // Redirect the unconnected user to the new game page so that he can join a game.
    if (!isAuth) {
      router.replace("/dashboard/new-game");
    }
  }, [isAuth, router]);

  useEffect(() => {
    // Animate the veil when showLoginPanel changes. We want to fade it in and out, and also toggle its display to avoid it being clickable when not shown.
    // Hidden when not shown
    if (!veil.current) return;

    if (showLoginPanel) {
      veil.current.style.opacity = "0";
      veil.current.style.display = "block";

      const frame = requestAnimationFrame(() => {
        if (veil.current) {
          veil.current.style.opacity = "1";
        }
      });

      return () => cancelAnimationFrame(frame);
    }

    veil.current.style.opacity = "0";
    const hideTimeout = setTimeout(() => {
      if (veil.current) {
        // Remove inline display so Tailwind `hidden` applies again.
        veil.current.style.display = "";
      }
    }, 700);

    return () => clearTimeout(hideTimeout);
  }, [showLoginPanel]);

  if (!isAuth) {
    // If the user is not connected, we dont only show the children but also the login panel if showLoginPanel is true (with a clickable veil behind it)
    return (
      <div className="flex justify-center">
        <div className="flex-1">{children}</div>
        <div
          onClick={() => setShowLoginPanel(false)}
          ref={veil}
          className="hidden opacity-0 absolute inset-0 backdrop-blur-xs bg-ink-black-950/30 z-10 transition-opacity duration-300"
        ></div>
        {showLoginPanel && <Login />}
      </div>
    );
  }

  return children;
}
