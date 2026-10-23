export default function KnowMore() {
  return (
    <div>
      <header className="pt-25 px-5 pb-5 flex flex-col gap-4 gradient-bg text-foreground-light">
        <h1>En apprendre plus sur Dartsify</h1>
        <p className="text-foreground-light-soft">
          Dartsify est une application pour organiser et suivre des parties de
          fléchettes simplement: création de parties, gestion des joueurs, choix
          de cibles et suivi des résultats.
        </p>
      </header>
      <main className="main-content horizontal-p vertical-p w-full">
        <section className="default-section gap-4 mt-8">
          <h2 className="mb-1">Ce que propose le projet</h2>
          <div className="ml-3">
            <p>• Création de parties solo ou multi-joueurs</p>
            <p>• Gestion des cibles et des modes de jeu</p>
            <p>• Tableau de bord des parties en cours et terminées</p>
            <p>• Statistiques pour suivre votre progression</p>
          </div>
        </section>

        <section className="default-section gap-4 mt-8">
          <h2 className="mb-1">Version actuelle</h2>
          <p className="ml-3">
            Cette page est provisoire et sera enrichie prochainement avec plus
            de détails sur le fonctionnement, la roadmap et les nouveautés.
          </p>
        </section>
      </main>
    </div>
  );
}
