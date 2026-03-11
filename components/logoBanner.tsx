import Image from "next/image";

import logo_white from "../public/logo_white.svg";
import Link from "next/link";

export default function LogoBanner({ isOpen }: { isOpen: boolean }) {
  return (
    <Link
      href="/"
      className={`flex items-center h-15 transition-all duration-300 ease-in-out ${
        isOpen ? "justify-start gap-1" : "justify-center gap-0"
      }`}
    >
      <Image
        src={logo_white}
        alt="Logo"
        width={50}
        className="h-10 object-contain"
      />
      <b
        className={`text-2xl mt-2 text-white font-satoshi font-black whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 max-w-40 ml-0" : "opacity-0 max-w-0 ml-0"
        }`}
      >
        Dartsify
      </b>
    </Link>
  );
}
