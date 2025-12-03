"use client";

import { FaChrome } from "react-icons/fa";

export default function GetEth() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-extrabold mb-6">Get Sepolia Test ETH</h1>

      <p className="text-gray-400 max-w-xl mb-8">
        To interact with Cyber Co (register, like, comment, follow), you’ll need a
        small amount of <span className="font-semibold">SepoliaETH</span>.
      </p>

      <a
        href="https://sepolia-faucet.pk910.de/"
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary no-underline px-6 py-3 text-lg inline-flex items-center gap-2"
      >
        Mine test currency <FaChrome className="text-sm" />
      </a>

      <p className="small-muted mt-6">
        This is free test ETH — no real funds required.
      </p>
    </div>
  );
}
