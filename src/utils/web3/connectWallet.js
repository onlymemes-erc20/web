export default async function connectWallet(autoConnect) {
  let ethereum = window.ethereum;
  if (!ethereum) {
    console.log("No MetaMask detected.");
    return;
  }
  if (autoConnect) {
    console.log("autoconnect");
    return await autoConnectWallet(ethereum);
  } else {
    console.log("manually connect");
    return await manuallyConnectWallet(ethereum);
  }
}

async function autoConnectWallet(ethereum) {
  try {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
    return accounts[0];
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function manuallyConnectWallet(ethereum) {
  try {
    if (!ethereum.isConnected()) {
      console.log("MetaMask not connected");
      return;
    }
  } catch (error) {
    console.error(error);
    try {
      ethereum = await window.ethereum.providers.find(
        (provider) => provider.isMetaMask
      );
    } catch (error) {
      console.error(error);
    }
  }

  const chainId = await ethereum.request({ method: "eth_chainId" });
  if (chainId !== "0x1") {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
  }

  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    console.error(error);
  }
}
