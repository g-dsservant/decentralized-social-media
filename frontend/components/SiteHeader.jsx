"use client";

import Link from "next/link";
import { FaEthereum } from "react-icons/fa";
import { useWallet } from "../context/WalletContext";

export default function SiteHeader() {
  const { account, connect, disconnect } = useWallet();

  return (
    <header className="w-full border-b border-white/10 bg-[#0b1119]/80 backdrop-blur-md">
      {/* 1. Changed max-w-6xl to max-w-full (or max-w-7xl) to widen the header */}
      <div className="w-full px-8 py-4 flex items-center justify-between"> 

        {/* Left side */}
        <div className="flex items-center gap-6">

          {/* Navigation */}
          {/* 2. Increased gap-5 to gap-10 for better spacing */}
          <nav className="flex items-center gap-8">
            <Link href="/home" className="text-white visited:text-white hover:text-cyan-300 transition">
            Home
            </Link>
            <Link href="/profile" className="text-white visited:text-white hover:text-cyan-300 transition">
            Profile
            </Link>
            <Link href="/get-eth" className="text-white visited:text-white hover:text-cyan-300 transition">
            GET SepETH
            </Link>
            </nav>

        </div>

        {/* Right side */}
        <div className="text-sm text-gray-400">
          {account ? (
            <div className="flex items-center gap-2">
              <span className="bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <button
                onClick={disconnect}
                className="btn btn-ghost border border-white/10 hover:bg-white/10 transition"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="btn btn-primary"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
