import Image from "next/image";
import Link from "next/link";
import gsap from "gsap"; // <-- import GSAP
import { useGSAP } from "@gsap/react"; // <-- import the hook from our React package

import autodarts from "@/public/autodarts.png";

import Button from "@/components/buttons/styleButtons/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP); // register the hook to avoid React version discrepancies
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return (
    <div>
      {/* Header -> image + CTA*/}
      <header className="gradient-bg-reverse grid grid-rows-[clamp(320px,50%,600px)_1fr] sm:grid-rows-none sm:grid-cols-[clamp(200px,50%,600px)_1fr] pt-15 pb-20 sm:py-15 items-center min-h-[60vh] text-white relative overflow-x-hidden">
        <Image
          src={autodarts}
          height={600}
          alt="Cible de fléchettes"
          className="translate-x-1/5 sm:-translate-x-1/5 w-[50vw] min-w-80 sm:min-w-50 max-w-150 justify-self-end sm:justify-normal"
        />
        <div className="flex-1 px-6 sm:pr-6 sm:pl-0 sm:-ml-5">
          <h1 className="mb-5">Dartsify</h1>
          <p className="font-medium leading-5 text-lg">
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
            {/* <Link href={"/dashboard/new-game"}>
              <Button title={"Nouvelle Partie"} />
            </Link> */}
            <Link href={"/dashboard"}>
              <Button title={"Jouer"} />
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

      <main className="default-p px-6 md:px-15 lg:px-25 flex flex-col gap-10 my-10">
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
    // <div>
    //   <header>
    //     <h1>Ceci est la Landing Page</h1>
    //     <p>En construction...</p>
    //   </header>

    //   <main className="flex flex-col gap-10">
    //     <div className="bg-background-dark rounded-lg flex items-center justify-center m-10 py-5 border-border border">
    //       <Link
    //         className="brand-link font-bold text-lg hover:opacity-50 transition-opacity duration-250"
    //         href={"/dashboard"}
    //       >
    //         {` -> `} Go to Dashboard
    //       </Link>
    //     </div>
    //     <div className="bg-brand px-20 relative flex gap-10 py-20">
    //       <div className="custom-shape-divider-top-1773601366">
    //         <svg
    //           data-name="Layer 1"
    //           xmlns="http://www.w3.org/2000/svg"
    //           viewBox="0 0 1200 120"
    //           preserveAspectRatio="none"
    //         >
    //           <path
    //             d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
    //             className="shape-fill"
    //           ></path>
    //         </svg>
    //       </div>
    //       <h2 className="text-foreground-light max-w-60 leading-8">
    //         Ceci est un autre exemple de carte
    //       </h2>
    //       <p className="text-foreground-light-soft">
    //         Ceci est un texte descriptif.
    //         <br />
    //         Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
    //         consequuntur laboriosam architecto hic eum accusamus, temporibus
    //         ullam? Dicta consectetur, possimus velit quas dolor iusto neque at
    //         atque, eaque ad assumenda!
    //       </p>
    //       <div className="custom-shape-divider-bottom-1773262308">
    //         <svg
    //           data-name="Layer 1"
    //           xmlns="http://www.w3.org/2000/svg"
    //           viewBox="0 0 1200 120"
    //           preserveAspectRatio="none"
    //         >
    //           <path
    //             d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
    //             className="shape-fill"
    //           ></path>
    //         </svg>
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
}
