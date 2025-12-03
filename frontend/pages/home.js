"use client";

import { useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { FaEthereum } from "react-icons/fa";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";
import CreatePost from "../components/CreatePost";
import Feed from "../components/Feed";
import { ethers } from "ethers";

export default function Home() {
  const { account, provider, signer, connect } = useWallet();

  // Load feed automatically if provider is ready (WalletContext will handle injected wallet)
  useEffect(() => {
    // Feed.jsx handles its own loading internally, so no need to do anything here.
  }, [provider, signer]);

  // A helper ONLY for read-only mode (no wallet)
  async function loadFeedReadOnly() {
    try {
      alert("Feed will load below (Feed component auto-loads)");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="app-container">
      <h1 className="text-4xl font-extrabold mb-6 flex items-center gap-3 eth-title">
  <FaEthereum className="text-accent-500 text-5xl drop-shadow-eth" />
  <span className="font-display">CYBER CO.</span>
</h1>



      {/* IF NOT CONNECTED */}
      {!account ? (
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => connect()}
            className="btn btn-primary"
          >
            Connect Wallet
          </button>

          <button
            onClick={loadFeedReadOnly}
            className="btn btn-ghost"
          >
            Load Feed (read-only)
          </button>
        </div>
      ) : (
        <div className="mb-6 space-y-4">
          <div className="text-sm text-gray-400">
            Connected as{" "}
            <code className="text-accent-500">{account}</code> —{" "}
            <a href="/profile" className="text-accent-500 hover:underline">
              Edit/View Profile
            </a>
          </div>

          {/* Create Post UI */}
          <CreatePost />

          <button
            className="btn btn-ghost mt-2"
            onClick={() => window.location.reload()}
          >
            Refresh Feed
          </button>
        </div>
      )}

      <hr className="my-6 border-white/10" />

      <h2 className="text-xl font-semibold mb-4">Feed</h2>

      {/* FEED COMPONENT */}
      <Feed />
    </div>
  );
}
