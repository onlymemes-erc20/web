import Image from "next/image";

export default function Profile() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image width={300} height={300} src={"/oflogo.svg"} alt="OnlyMemes!" />
    </main>
  );
}

//@todo wallet balance revalidation
