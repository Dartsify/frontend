"use client";

import { User } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginGate({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | boolean;
  // User if User Data,
  // False if not authenticated
}) {
  const [isAuth, setIsAuth] = useState<boolean>(!!user); // If user data exists (e.g. data retrieve from server after getting the token from cookies), consider the user authenticated

  const router = useRouter();

  const toggleAuth = () => {
    setIsAuth((prev) => !prev);
  };

  if (!isAuth) {
    // router.push("/dashboard/new-game");
    return (
      <div>
        You are not authenticated. Please log in to access the dashboard.
      </div>
    );
  }

  return children;
}
