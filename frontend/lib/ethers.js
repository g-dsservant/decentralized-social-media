import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

export async function getContract() {
  if (typeof window === "undefined") {
    throw new Error("getContract() must be called in the browser.");
  }
  if (!window.ethereum) {
    throw new Error("No MetaMask found.");
  }

  // Request wallet connection
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Provider
  const provider = new BrowserProvider(window.ethereum);

  // Signer
  const signer = await provider.getSigner();

  // Build contract
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  return contract;
}
