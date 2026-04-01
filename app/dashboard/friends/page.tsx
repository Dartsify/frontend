import FriendsListSection from "@/components/sections/friendsListSection";
import FriendsRequestsSection from "@/components/sections/friendsRequestsSection";
import { getMyFriends, getMyFriendsRequests } from "@/lib/fastapi/players";

export default async function Friends() {
  const myFriendsRequests = await getMyFriendsRequests();
  const myFriends = await getMyFriends();

  const { data: friendsRequestsData, error: friendsRequestsError } =
    myFriendsRequests;
  const { data: friendsData, error: friendsError } = myFriends;

  if (friendsRequestsError || !friendsRequestsData) {
    if (typeof friendsRequestsError === "string") {
      return <div>Error: {friendsRequestsError}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  if (friendsError || !friendsData) {
    if (typeof friendsError === "string") {
      return <div>Error: {friendsError}</div>;
    }
    return <div>Error: Erreur Inconnue</div>;
  }

  return (
    <div>
      <h1>Amis</h1>

      <main className="main-container">
        <FriendsRequestsSection
          friends={[
            ...friendsRequestsData,
            ...friendsRequestsData,
            ...friendsRequestsData,
            ...friendsRequestsData,
            ...friendsRequestsData,
            ...friendsRequestsData,
          ]}
        />
        <FriendsListSection friends={friendsData} />
      </main>
    </div>
  );
}
