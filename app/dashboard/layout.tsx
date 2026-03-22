import { Suspense } from "react";

import Providers from "./providers";

import { User } from "@/utils/types";

import { getUserData } from "@/lib/fastapi/users";

import LoginGate from "@/components/login/loginGate";
import NavWrapper from "@/components/nav/navWrapper";
import Loading from "../loading";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Loading.tsx with NextJS only works with children of layout.tsx
  // So if the await for getting the data is in the main function, it will block the entire layout and thus the loading screen won't be displayed
  // <Suspense> do the same, it allows to display a fallback while waiting for the children to be loaded
  // The solution is to create an inner async function (as a child) (i.e. content) that will be called in the main function, and that will contain the await for getting the data, so that the loading screen can be displayed while waiting for the data to be fetched
  //  => The data is loaded in the child (i.e. the content function) and not in the main function
  const content = async () => {
    const user: User | boolean = await getUserData();

    return (
      <Providers user={user}>
        <LoginGate user={user}>
          <NavWrapper>
            <div className="content">{children}</div>
          </NavWrapper>
        </LoginGate>
      </Providers>
    );
  };

  // const loading = () => (
  //   <div className="h-screen w-screen gradient-bg flex items-center justify-center text-foreground-light">
  //     <div className="loader-circle animate-spin-alt" />
  //   </div>
  // );

  return <Suspense fallback={Loading()}>{content()}</Suspense>;
}
