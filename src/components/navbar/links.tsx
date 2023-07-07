import Link from "next/link";

const Links = () => {
  return (
    <div className="flex gap-4">
      <Link href="/"> About </Link>
      <Link href="/"> Tokenomics </Link>
      <Link href="/"> Buy </Link>
      <Link href="/"> Roadmap </Link>
      <Link href="/memes"> Memes</Link>
    </div>
  );
};

export default Links;
