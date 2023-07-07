import Image from "next/image";
import Login from "./login";
import Links from "./links";

export default function Navbar({}) {
  return (
    <div className="flex w-full justify-between items-center">
      <Image
        width={150}
        height={150}
        className="m-2"
        src={"/oflogo.svg"}
        alt="OnlyMemes!"
      />
      <Links />
      <Login />
    </div>
  );
}
