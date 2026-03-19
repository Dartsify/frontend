import LoginGate from "@/components/login/loginGate";
import NavWrapper from "@/components/nav/navWrapper";
import { getUserData } from "@/lib/fastapi/users";
import { User } from "@/utils/types";
import Providers from "./providers";

export default async function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
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
}