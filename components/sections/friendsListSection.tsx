import { Friend } from "@/utils/types";

export default function FriendsListSection({ friends }: { friends: Friend[] }) {
  const listItem = (friend: Friend, index: number) => {
    return <p>test</p>;
  };

  return (
    <section id="friends-list-section" className="default-section">
      <h2>Liste d'amis</h2>
      {friends.length === 0 ? (
        <p>Ajoutez des amis pour les voir ici !</p>
      ) : (
        <ul>{friends.map((item, index) => listItem(item, index))}</ul>
      )}
    </section>
  );
}
