import connectWallet from "../web3/connectWallet";
import sliceAddress from "../web3/sliceAddress";
import authenticateUser from "../firebase/authenticateUser";

type CheckWalletProps = {
  setWalletAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  setShortAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
  autoConnect?: boolean;
  authenticate?: boolean;
};

const checkWallet: (props: CheckWalletProps) => Promise<void> = async ({
  setWalletAddress,
  setLoadingMessage,
  setShortAddress,
  autoConnect = false,
  authenticate = true,
}) => {
  const walletAddress = await connectWallet(autoConnect);
  if (walletAddress) {
    const newShortAddress = sliceAddress(walletAddress);
    setWalletAddress(walletAddress);
    setShortAddress(newShortAddress);
    setLoadingMessage(`Hello, ${newShortAddress}`);
    if (authenticate) {
      authenticateUser(walletAddress, setLoadingMessage);
    }
  }
};

export default checkWallet;
