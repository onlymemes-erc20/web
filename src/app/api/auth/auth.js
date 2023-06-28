import { SetCookie } from "./cookies";
import checkBalance from "@/utils/web3/checkBalance";
import { verifyMessage } from "ethers";
import { sign } from "jsonwebtoken";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.SERVICE_ACCOUNT_TYPE,
      projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
      privateKeyId: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
      clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
      clientId: process.env.SERVICE_ACCOUNT_CLIENT_ID,
      authUri: process.env.SERVICE_ACCOUNT_AUTH_URI,
      tokenUri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
      authProviderX509CertUrl:
        process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
      clientC509CertUrl: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
    }),
  });
}
// Firebase App initialization
let threshold = 0.01;

export default async function Auth(data) {
  const { walletAddress, signedMessage, nonce } = data;
  const recoveredAddress = verifyMessage(`nonce:${nonce}`, signedMessage);
  if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new Error("Unauthorized");
  }
  const isAuthenticated = await checkBalance(recoveredAddress, threshold);
  if (isAuthenticated) {
    try {
      const token = sign({ walletAddress }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const firebaseToken = await admin.auth().createCustomToken(walletAddress);
      return await SetCookie(token, walletAddress);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("Unauthorized");
  }
}

//@todo i need to separate cookie release from check balance because if the balance changes then they will still have access... we need to be testing on goerli
