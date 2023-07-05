"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

import connectWallet from "@/utils/web3/connectWallet";
import sliceAddress from "@/utils/web3/sliceAddress";
import authenticateUser from "@/utils/firebase/authenticateUser";
import app from "@/utils/firebase/firebase";

import Tooltip from "./base/tooltip";

type LoginProps = {
  walletAddress: string | undefined;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const Login = ({
  walletAddress,
  isLoggedIn,
  setIsLoggedIn,
  setWalletAddress,
}: LoginProps) => {
  const [shortAddress, setShortAddress] = useState<string | undefined>(
    undefined
  );
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
    undefined
  );
  const auth = getAuth(app);

  const checkWallet = useCallback(
    async (autoConnect = false, authenticate = true) => {
      const walletAddress = await connectWallet(autoConnect);
      if (walletAddress) {
        const newShortAddress = sliceAddress(walletAddress);
        setWalletAddress(walletAddress);
        setShortAddress(newShortAddress);

        if (authenticate) {
          authenticateUser(walletAddress, setLoadingMessage);
        }
        setLoadingMessage(`Hello, ${newShortAddress}`);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    signOut(auth)
      .then(() => {
        setWalletAddress(undefined);
        setShortAddress(undefined);
        localStorage.setItem("loggedOut", "true");
        setIsLoggedIn(false);
        setLoadingMessage(undefined);
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.removeItem("loggedOut");
        checkWallet(true, false);
        setLoadingMessage(`Hello, ${shortAddress}`);
        setIsLoggedIn(true);
      } else {
        console.log("not logged in");
      }
    });
    return () => unsubscribe();
  }, [checkWallet]);

  return (
    <div className="flex items-center mx-4 flex-row items-center gap-0">
      {loadingMessage && (
        <p className="text-blue-600 text-sm">{loadingMessage}</p>
      )}
      <Tooltip tooltip={walletAddress ? "Disconnect" : "Metamask"}>
        <button
          className="rounded bg-blue-400 px-4 py-2 text-sm text-white shadow-sm"
          onClick={walletAddress ? () => logout() : () => checkWallet()}>
          {isLoggedIn ? "Logout" : walletAddress ? shortAddress : "Connect"}
        </button>
      </Tooltip>
    </div>
  );
};

export default Login;
