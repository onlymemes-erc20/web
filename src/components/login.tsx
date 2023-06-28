"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

import connectWallet from "@/utils/web3/connectWallet";
import sliceAddress from "@/utils/web3/sliceAddress";
import authenticateUser from "@/utils/authenticateUser";
import app from "@/utils/firebase";

import Tooltip from "./base/tooltip";
import Upload from "./upload";

const Login = () => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [shortAddress, setShortAddress] = useState<string | undefined>(
    undefined
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(undefined);
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
        setLoadingMessage(`Welcome, ${newShortAddress}`);
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
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.removeItem("loggedOut");
        checkWallet(true, false);
        setLoadingMessage(`Welcome, ${shortAddress}`);
        setIsLoggedIn(true);
      } else {
        console.log("not logged in");
      }
    });
    return () => unsubscribe();
  }, [checkWallet]);

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     setIsRedirected(true);
  //   };

  //     //   router.push("/dashboard/");
  //     console.log(router);
  //     //this needs pathname == dashboard (but really doesnt that change before it all loads)
  //     // suspense maybe?
  //     // router.events.on("routeChangeComplete", handleRouteChange);
  //   }
  //   return () => {
  //     // router..off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router]);

  return (
    <div className="flex w-full h-100 items-center">
      <Tooltip tooltip={walletAddress ? "Logout" : "Connect"}>
        <button
          className="rounded bg-blue-400 px-4 py-2 text-sm text-white shadow-sm"
          onClick={walletAddress ? () => logout() : () => checkWallet()}>
          {walletAddress ? shortAddress : "Connect"}
        </button>
      </Tooltip>
      {loadingMessage && <p className="text-blue-600">{loadingMessage}</p>}
      {isLoggedIn && <Upload walletAddress={walletAddress} />}
    </div>
  );
};

export default Login;
