import { getAuth, signInWithCustomToken } from "firebase/auth";
import SignMessage from "@/utils/web3/signMessage";
import app from "@/utils/firebase";

export default async function authenticateUser(
  walletAddress: string,
  setLoadingMessage: (msg: string) => void
) {
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
      const auth = getAuth(app);
      setLoadingMessage("Retrieving Token...");
      signInWithCustomToken(auth, firebaseToken).catch((error) => {
        console.error("Firebase auth error:", error);
      });
    } else {
      console.error("Unauthorized.");
    }
  }
}
