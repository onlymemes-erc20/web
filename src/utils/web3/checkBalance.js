import { ethers } from "ethers";
import Provider from "./provider";

export default async function checkBalance(walletAddress, threshold) {
  try {
    const balance = await Provider.getBalance(walletAddress);
    const balance_eth = ethers.formatEther(balance);
    return balance_eth >= threshold;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
