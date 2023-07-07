import { signOut, Auth } from "firebase/auth";

type LogoutProps = {
  auth: Auth;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setShortAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const logout = async ({
  auth,
  setWalletAddress,
  setIsLoggedIn,
  setLoadingMessage,
  setShortAddress,
}: LogoutProps) => {
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
};

export default logout;
