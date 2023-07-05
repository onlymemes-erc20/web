"use client";

import { useState } from "react";
import Image from "next/image";
import Display from "@/components/display";
import Login from "@/components/login";
import Upload from "@/components/upload";

type ProgressCallback = (progress: number) => void;

export default function MemePage() {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  return (
    <div className="w-full h-full">
      <div className="flex items-top justify-between w-full">
        <Image
          width={150}
          height={150}
          className="m-2"
          src={"/oflogo.svg"}
          alt="OnlyMemes!"
        />
        <Login
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
        />
      </div>
      <Upload
        walletAddress={walletAddress}
        isLoggedIn={isLoggedIn}
        progressCallback={setProgress}
        progress={progress}
      />
      <Display isLoggedIn={isLoggedIn} walletAddress={walletAddress} />
    </div>
  );
}
