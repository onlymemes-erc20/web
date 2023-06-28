export default async function SignMessage(address) {
  const nonce = Math.floor(Math.random() * 1000000);
  try {
    const signedMessage = await window.ethereum.request({
      method: "personal_sign",
      params: [address, `nonce:${nonce}`],
    });
    return { signedMessage, nonce };
  } catch (error) {
    console.error("Error signing message:", error);
  }
}
