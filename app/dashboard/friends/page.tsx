import AddFriend from "@/components/addFriend";
import ErrorPageText from "@/components/errorPageText";
import FriendsListSection from "@/components/sections/friends/friendsListSection";
import FriendsRequestsSection from "@/components/sections/friends/friendsRequestsSection";
import FriendsStatsSection from "@/components/sections/friends/friendsStatsSection";

import {
  getFriendsStatsSummary,
  getMyFriends,
  getMyFriendsRequests,
} from "@/lib/fastapi/players";

export default async function Friends() {
  const [myFriendsRequests, myFriends, friendsStatsSummary] = await Promise.all(
    [getMyFriendsRequests(), getMyFriends(), getFriendsStatsSummary()],
  );

  const { data: friendsRequestsData, error: friendsRequestsError } =
    myFriendsRequests;
  const { data: friendsData, error: friendsError } = myFriends;
  const { data: friendsStatsSummaryData, error: friendsStatsSummaryError } =
    friendsStatsSummary;

  if (friendsRequestsError || !friendsRequestsData) {
    if (typeof friendsRequestsError === "string") {
      return ErrorPageText(friendsRequestsError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  if (friendsError || !friendsData) {
    if (typeof friendsError === "string") {
      return ErrorPageText(friendsError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  if (friendsStatsSummaryError || !friendsStatsSummaryData) {
    if (typeof friendsStatsSummaryError === "string") {
      return ErrorPageText(friendsStatsSummaryError);
    }
    return ErrorPageText("Erreur Inconnue");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-0">Amis</h1>
        <AddFriend />
      </div>

      <main className="main-container">
        <FriendsRequestsSection friendsRequests={friendsRequestsData} />
        <FriendsStatsSection statsSummary={friendsStatsSummaryData} />
        <FriendsListSection friends={friendsData} />
      </main>
    </div>
  );
}
