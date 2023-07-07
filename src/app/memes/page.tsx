"use client";

import { useState } from "react";
import { useContext } from "react";
import Display from "@/components/display";
import Upload from "@/components/upload";
import { AuthContext } from "@/app/context/authContext";

type ProgressCallback = (progress: number) => void;

export default function MemePage() {
  const { walletAddress, isLoggedIn } = useContext(AuthContext);
  const [progress, setProgress] = useState<number>(0);
  return (
    <div className="w-full h-full">
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
