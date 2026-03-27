export const games = [
  // Keep it first bc it is the default game when creating a new game
  {
    name: "501",
    description:
      "Un jeu de fléchettes où les joueurs commencent avec un score de 501 et doivent réduire ce score à zéro en lançant des fléchettes sur le tableau.",
    slug: "501",
  },
  {
    name: "Custom Dartsify",
    description:
      "Un jeu de fléchettes spécialement conçu par Dartsify pour encore plus de fun !",
    slug: "custom-dartsify",
  },
  {
    name: "301",
    description:
      "Similaire au 501, mais les joueurs commencent avec un score de 301 et doivent réduire ce score à zéro.",
    slug: "301",
  },
];

export const gameNames: string[] = games.map((game) => game.name);
