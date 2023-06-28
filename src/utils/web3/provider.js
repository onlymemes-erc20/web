import { ethers } from "ethers";

let chain = "mainnet"; // 'mainnet'
const infura_address = `https://${chain}.infura.io/v3/f7d66f1ab91247ffbd7d40a7bd1fb65e`;
const Provider = new ethers.JsonRpcProvider(infura_address);

export default Provider;
