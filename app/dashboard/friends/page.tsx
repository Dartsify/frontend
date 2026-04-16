import AddFriend from "@/components/addFriend";
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
      <div className="flex items-center justify-between">
        <h1 className="mb-0">Amis</h1>
        <AddFriend />
      </div>

      <main className="main-container">
        <FriendsRequestsSection friends={friendsRequestsData} />
        <FriendsListSection friends={friendsData} />
      </main>
    </div>
  );
}
