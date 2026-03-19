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
    if (!isAuth) {
      // router.replace("/dashboard/new-game");
    }
  }, [isAuth, router]);

  // if (!isAuth) {
  //   return null;
  // }

  return children;
}
