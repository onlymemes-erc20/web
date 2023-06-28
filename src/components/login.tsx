"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import connectWallet from "@/utils/web3/connectWallet";
import sliceAddress from "@/utils/web3/sliceAddress";
import SignMessage from "@/utils/web3/signMessage";
import Tooltip from "./base/tooltip";
import firebase from "firebase/app";
import { parse } from "cookie";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import app from "../utils/firebase";

const Login = () => {
  const [isBalanceSufficient, setIsBalanceSufficient] = useState<
    boolean | undefined
  >(undefined);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [shortAddress, setShortAddress] = useState<string | undefined>(
    undefined
  );
  const [isRedirected, setIsRedirected] = useState<boolean | undefined>(
    undefined
  );

  const router = useRouter();

  const checkWallet = useCallback(async (autoConnect = false) => {
    const walletAddress = await connectWallet(autoConnect);
    if (walletAddress) {
      setWalletAddress(walletAddress);
      setShortAddress(sliceAddress(walletAddress));
    }
  }, []);

  const authUser = useCallback(async () => {
    if (walletAddress) {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "Page Load",
          cookiename: walletAddress,
        }),
      });
      if (response.ok) {
        const data = await response.json(); //@todo fix this response (cookies?)
        const firebaseToken = data.token; // assuming the response includes the token

        // Initialize Firebase auth
        const auth = getAuth(app);

        signInWithCustomToken(auth, firebaseToken)
          .then((userCredential) => {
            // Firebase auth successful
            setIsBalanceSufficient(true);
            localStorage.removeItem("loggedOut");
          })
          .catch((error) => {
            // Handle Firebase auth error here
            console.error("Firebase auth error:", error);
          });
      } else {
        const result = await SignMessage(walletAddress);
        if (result) {
          const { signedMessage, nonce } = result;
          const response = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              walletAddress,
              signedMessage,
              nonce,
              action: "Login",
            }),
          });
          const setCookieHeader = response.headers.get("Set-Cookie"); //@todo fix this response (cookies?)
          if (setCookieHeader) {
            const cookies = parse(setCookieHeader);
            const firebaseToken = cookies.firebaseToken;

            const auth = getAuth(app);

            signInWithCustomToken(auth, firebaseToken)
              .then((userCredential) => {
                // Firebase auth successful
                setIsBalanceSufficient(true);
                localStorage.removeItem("loggedOut");
              })
              .catch((error) => {
                // Handle Firebase auth error here
                console.error("Firebase auth error:", error);
              });
          } else {
            // Handle the case when the cookie header is null
            console.error("Set-Cookie header is missing.");
          }
        }
      }
    }
  }, [walletAddress]);

  //this doesn't disconnect the wallet but it simulates it (and triggers a sign request on connect)
  const logout = useCallback(async () => {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "Logout", cookiename: walletAddress }),
    });
    if (response.ok) {
      setWalletAddress(undefined);
      setShortAddress(undefined);
      setIsBalanceSufficient(undefined);
      localStorage.setItem("loggedOut", "true");
    }
  }, [walletAddress]);

  //if user has not logged out previously, we autoconnect
  useEffect(() => {
    const hasLoggedOut: string | null = localStorage.getItem("loggedOut");
    if (hasLoggedOut === "false") {
      checkWallet(true);
    }
  }, [checkWallet]);

  // Check the wallet balance and authenticate when wallet address changes
  useEffect(() => {
    authUser();
  }, [walletAddress, authUser]);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsRedirected(true);
    };

    if (isBalanceSufficient) {
      //   router.push("/dashboard/");
      console.log(router);
      //this needs pathname == dashboard (but really doesnt that change before it all loads)
      // suspense maybe?
      // router.events.on("routeChangeComplete", handleRouteChange);
    }
    return () => {
      // router..off("routeChangeComplete", handleRouteChange);
    };
  }, [isBalanceSufficient]);

  return (
    <div className="flex w-full h-100">
      <Tooltip tooltip={walletAddress ? "Logout" : "Connect"}>
        <button
          className="rounded bg-blue-400 px-4 py-2 text-sm text-white shadow-sm"
          onClick={walletAddress ? () => logout() : () => checkWallet()}>
          {walletAddress ? shortAddress : "Connect"}
        </button>
      </Tooltip>
      {isBalanceSufficient === true ? (
        isRedirected === true ? (
          <h1> Welcome to OnlyMemes</h1>
        ) : (
          <h1>Welcome, {shortAddress}</h1>
        )
      ) : isBalanceSufficient === false ? (
        <h1>Balance Insufficient.</h1>
      ) : null}
    </div>
  );
};

export default Login;
