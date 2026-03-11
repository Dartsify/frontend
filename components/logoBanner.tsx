import Image from "next/image";

import logo from "../public/logo.svg";
import Link from "next/link";

export default function LogoBanner() {
  return (
    <Link href="/" className="flex items-center h-15 gap-1">
      <Image src={logo} alt="Logo" width={50} className="h-15 object-contain" />
      <b className="text-2xl mt-2 text-primary font-satoshi font-black italic">
        Dartsify
      </b>
    </Link>
  );
}
