# Dartsify Frontend <!-- omit in toc -->

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Table des Matières <!-- omit in toc -->

- [Getting Started](#getting-started)
- [Learn More](#learn-more)
- [Deploy on Vercel](#deploy-on-vercel)
- [Notes Perso](#notes-perso)
  - [Icônes](#icônes)
  - [Cartes](#cartes)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Notes Perso

### Icônes

Pour les icônes de taille moyenne affichées tout le long du site, les tailles sont :

- 14 (e.g. icône de timer dans un badge) ;
- 16 (e.g. moveLeft & moveRight dans la sectionNotifications de la page d'accueil, play icon dans la même page) ;
- 22 (e.g. X icons dans les dialogs).

### Cartes

Il y a 3 types de cartes :

- **_card_ :** carte normale avec un titre, un sous-titre optionnel et du contenu ;
- **_card-sm_ :** carte plus petite avec un titre en uppercase de couleur secondaire ;
- **_card-xs_ :** carte identique à la carte small mais avec un texte de contenu en gras.

On affiche une carte normale par défaut, lorsque l'on veut afficher uniquement un titre et une valeur (ex. dans une carte "Parties Jouées - 4"), on utilise plutôt l'affiche _card-xs_. Si le contenu est plus long qu'un simple nombre, alors on optera plutôt pour un affichage _card-sm_.

Une instancie une carte standard de cette manière :

```html
<div className="card">
  <h3>Podium des cibles favorites</h3>
  <p className="subtitle">Les zones que vous visez avec le plus de succès.</p>
  <div className="content">
    <!-- Si on veut diminuer ou augmenter la marge sup. spécifiquement pour une carte, on modifie ici dans la div, content présente une marge par défaut -->
    <Podium targets="{favorite_targets}" />
  </div>
</div>
```

Pour une carte de type _card-xs_, on optera pour cette écriture :

```html
<div className="card card-xs">
  <h4>Parties jouées</h4>
  <p>4</p>
</div>
```
