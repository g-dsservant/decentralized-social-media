// frontend/constants.js

// Import your contract ABI (build/compile output copied to frontend)
import SocialArtifact from "./SocialDApp.json";

// Contract address from environment (NEXT_PUBLIC_*)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

// ABI export (used everywhere)
export const CONTRACT_ABI = SocialArtifact.abi;

// Optional secondary exports if you want named versions
export const SOCIAL_CONTRACT_ADDRESS = CONTRACT_ADDRESS;
export const SOCIAL_CONTRACT_ABI = CONTRACT_ABI;
