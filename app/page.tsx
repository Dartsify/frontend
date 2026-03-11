import Image from "next/image";
import autodarts from "@/public/autodarts.png";
import Button from "@/components/buttons/styleButtons/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Header -> image + CTA*/}
      <header className="gradient-bg flex items-center min-h-[60vh] gap-0 text-white relative">
        <Image
          src={autodarts}
          height={600}
          alt="Cible de fléchettes"
          className="-translate-x-1/5 "
        />
        <div className="ml-4">
          <h1 className="font-satoshi mb-2">Dartsify</h1>
          <p className="font-medium leading-5">
            Bienvenue sur Dartsify, votre compagnon ultime pour suivre vos
            performances au jeu de fléchettes !
          </p>
          {/* <p className="font-medium leading-5 mt-2">
            Que vous soyez un joueur occasionnel ou un compétiteur passionné,
            Dartsify vous offre une plateforme intuitive pour enregistrer vos
            parties, analyser vos statistiques et suivre votre progression au
            fil du temps. Rejoignez-nous dès aujourd'hui et améliorez votre jeu
            de fléchettes avec Dartsify !
          </p> */}
          <div className="flex gap-2 mt-8">
            <Link href={"/new-game"}>
              <Button title={"Nouvelle Partie"} />
            </Link>
            <Link href={"/know-more"}>
              <Button title={"En Apprendre Plus"} />
            </Link>
          </div>
        </div>
        <div className="custom-shape-divider-bottom-1773262308">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </header>

      <main className="default-p flex flex-col gap-10">
        {/* Section Qui-sommes-nous */}
        <section>
          <h2>Qui sommes-nous ?</h2>
          <p>
            Que vous soyez un joueur occasionnel ou un compétiteur passionné,
            Dartsify vous offre une plateforme intuitive pour enregistrer vos
            parties, analyser vos statistiques et suivre votre progression au
            fil du temps. Rejoignez-nous dès aujourd'hui et améliorez votre jeu
            de fléchettes avec Dartsify !
          </p>
        </section>

        {/* Section Vous-êtes-intéressé */}
        <section>
          <h2>Vous êtes intéressé ?</h2>
          <p>
            Vous avez un bar et vous seriez partant pour intégrer Dartsify dans
            votre établissement ? Contactez-nous via notre formulaire de contact
            et nous serons ravi de vous répondre durant la semaine.
          </p>
        </section>
      </main>
    </div>
  );
}
