import Image from "next/image";

import logo from "../public/logo.png";
import Link from "next/link";

export default function LogoBanner() {
  return (
    <Link href={"/"}>
      <div className="flex items-center gap-2">
        {/* <Image src={logo} alt="Logo" width={50} className="w-15" /> */}
        <div className="bg-gray-400 aspect-square h-10"></div>
        <b className="text-lg">Dartsify</b>
      </div>
    </Link>
  );
}
