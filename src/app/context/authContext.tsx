import { createContext, useState, useEffect, useContext } from "react";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../utils/firebase/firebase";
import checkWallet from "../../utils/auth/checkWallet";
import logout from "../../utils/auth/logout";
import { ToastContext } from "./toastContext";

type AuthContextProps = {
  walletAddress: string | undefined;
  shortAddress: string | undefined;
  isLoggedIn: boolean;
  loadingMessage: string | undefined;
  triggerCheckWallet: React.Dispatch<React.SetStateAction<boolean>>;
  triggerLogout: React.Dispatch<React.SetStateAction<boolean>>;
  auth: Auth;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );
  const [shortAddress, setShortAddress] = useState<string | undefined>(
    undefined
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(
    undefined
  );

  const [checkWalletTrigger, setCheckWalletTrigger] = useState<boolean>(false);
  const [logoutTrigger, setLogoutTrigger] = useState<boolean>(false);

  const auth = getAuth(app);

  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    if (checkWalletTrigger) {
      checkWallet({
        setWalletAddress,
        setLoadingMessage,
        setShortAddress,
        autoConnect: false,
        authenticate: true,
      });
      setCheckWalletTrigger(false); // Reset the trigger
    }
  }, [checkWalletTrigger]);

  useEffect(() => {
    if (logoutTrigger) {
      logout({
        auth,
        setWalletAddress,
        setIsLoggedIn,
        setShortAddress,
        setLoadingMessage,
      });
      setLogoutTrigger(false); // Reset the trigger
    }
  }, [logoutTrigger]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.removeItem("loggedOut");
        checkWallet({
          setWalletAddress,
          setLoadingMessage,
          setShortAddress,
          autoConnect: true,
          authenticate: false,
        });
        setIsLoggedIn(true);
      } else {
        console.log("not logged in");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loadingMessage) {
      if (showToast) {
        showToast(loadingMessage);
      } else {
        console.log("undefined");
      }
    }
  }, [loadingMessage]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        walletAddress,
        shortAddress,
        isLoggedIn,
        loadingMessage,
        triggerCheckWallet: setCheckWalletTrigger,
        triggerLogout: setLogoutTrigger,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
