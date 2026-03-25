const routes: { [key: string]: string } = {
  "/dashboard": "Accueil",
  "/dashboard/new-game": "Nouvelle Partie",
  "/dashboard/stats": "Statistiques",
  "/dashboard/my-games": "Mes Parties",
  "/dashboard/groups-players": "Groupes de Joueurs",
  "/dashboard/account": "Mon Compte",
  "/dashboard/groups-players/create": "Créer un Groupe de Joueurs",
  "/know-more": "En apprendre plus",
  // "/dashboard/my-games/[id]": "Partie [id]",
};

const routeNames: { [key: string]: string } = {
  "": "Accueil",
  "new-game": "Nouvelle Partie",
  stats: "Statistiques",
  "my-games": "Mes Parties",
  "groups-players": "Groupes de Joueurs",
  account: "Mon Compte",
  create: "Créer",
  "know-more": "En apprendre plus",
};

const routesWithColoredHeader: [string] = ["/"];

export { routes, routeNames, routesWithColoredHeader };
