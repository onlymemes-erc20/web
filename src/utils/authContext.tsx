import React, { createContext, useState } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import SignMessage from "@/utils/web3/signMessage";
import app from "@/utils/firebase/firebase";

type AuthContextProps = {
  walletAddress: string | undefined;
  isLoggedIn: boolean;
  loadingMessage: string | undefined;
  checkWallet: () => void;
  logout: () => void;
};

export const AuthContext = createContext<Partial<AuthContextProps>>({});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
    undefined
  );

  const auth = getAuth(app);

  const authenticateUser = async () => {
    setLoadingMessage("Awaiting sign...");
    const result = await SignMessage(walletAddress);
    if (result) {
      const { signedMessage, nonce } = result;
      setLoadingMessage("Checking Balance...");
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
      if (response.ok) {
        const data = await response.json();
        const firebaseToken = data.token;
        setLoadingMessage("Retrieving Token...");
        signInWithCustomToken(auth, firebaseToken).catch((error) => {
          console.error("Firebase auth error:", error);
        });
      } else {
        console.error("Unauthorized.");
      }
    }
  };

  const checkWallet = () => {
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
  };

  const logout = () => {
    // code to logout
  };

  return (
    <AuthContext.Provider
      value={{
        walletAddress,
        isLoggedIn,
        loadingMessage,
        checkWallet,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
