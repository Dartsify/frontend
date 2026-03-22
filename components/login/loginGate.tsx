"use client";

import { User } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  useEffect(() => {
    // Redirect the unconnected user to the new game page so that he can join a game.
    if (!isAuth) {
      router.replace("/dashboard/new-game");
    }
  }, [isAuth, router]);

  return children;
}
