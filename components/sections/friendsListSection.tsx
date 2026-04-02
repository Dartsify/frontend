import Image from "next/image";

import { Friend } from "@/utils/types";

export default function FriendsListSection({ friends }: { friends: Friend[] }) {
  const handleShowControls = (username: string) => {};

  const listItem = (friend: Friend, index: number) => {
    const { name, username } = friend;

    return (
      <div
        onClick={() => handleShowControls(username)}
        className="card flex gap-2 items-center hover-scale-2"
        key={index}
      >
        <div className="rounded-lg relative">
          <Image
            src={`https://avatars.githubusercontent.com/${username}`}
            alt="Avatar"
            objectFit="cover"
            fill
          />
        </div>

        <h4>
          {name} (@{username})
        </h4>
      </div>
    );
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
