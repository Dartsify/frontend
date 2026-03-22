"use client";

import { User } from "@/utils/types";
import moment from "moment";
import "moment/locale/fr"; // Import the French locale for Moment.js
import { useEffect, useState, createContext } from "react";

type UserDataContextType = {
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserDataContext = createContext<UserDataContextType | null>(null);

export default function Providers({
  user,
  children,
}: {
  user: User | boolean;
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<User | null>(
    typeof user === "object" ? user : null,
  ); // If user is a User object, set userData to it, otherwise set it to null

  const [showLoginPanel, setShowLoginPanel] = useState(false); // State to control the visibility of the login panel

  useEffect(() => {
    console.log("UserData updated:", user);
    setUserData(typeof user === "object" ? user : null);
  }, [user]);

  // Ensure Moment uses French locale on the client side
  useEffect(() => {
    try {
      moment.locale("fr");
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
