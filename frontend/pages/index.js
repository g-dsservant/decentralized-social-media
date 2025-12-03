"use client";

import Link from "next/link";
import { FaEthereum, FaArrowDown, FaArrowRight, FaChrome } from "react-icons/fa";

export default function Landing() {
  function scrollToSteps() {
    const steps = document.getElementById("onboarding-steps");
    if (steps) {
      steps.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen w-full">
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="flex items-center gap-3 mb-4">
          <FaEthereum className="text-4xl drop-shadow-eth text-[var(--accent)]" />
          <h1 className="text-5xl font-extrabold eth-title font-display">
            CYBER CO.
          </h1>
        </div>

        <p className="text-gray-400 text-lg max-w-xl mb-8">
          A decentralized social network powered by Ethereum. Own your posts, not the platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-3">
          <Link
            href="/home"
            className="btn btn-primary no-underline px-6 py-3 text-base inline-flex items-center gap-2 justify-center"
          >
            Enter App <FaArrowRight className="text-sm" />
          </Link>

          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost px-6 py-3 text-sm inline-flex items-center gap-2 justify-center"
          >
            <FaChrome className="text-lg" />
            Install MetaMask
          </a>
        </div>

        <p className="small-muted">
          No funds required — you're using the Sepolia test network.
        </p>

        <button
  onClick={scrollToSteps}
  className="mt-20 flex flex-col items-center gap-1 cursor-pointer 
             bg-transparent border-0 outline-none 
             text-[var(--muted)] hover:text-[var(--accent)] 
             transition-colors"
  style={{ backgroundColor: "transparent" }}
>
  <span className="text-xs tracking-widest select-none">
    scroll for setup
  </span>

  <FaArrowDown className="text-[var(--accent)] text-xl animate-bounce select-none" />
</button>


      </section>

      <section
        id="onboarding-steps"
        className="min-h-screen px-4 py-20 flex justify-center"
      >
        <div className="max-w-3xl w-full card p-8 space-y-7">
          <p className="uppercase text-xs tracking-[0.2em] text-[var(--muted)]">
  Few steps to begin socials
</p>

{/* Step 1 */}
<div className="flex gap-4">
  <div className="w-7 h-7 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-xs font-bold text-[var(--accent)]">
    1
  </div>

  <div className="space-y-2">
    <h3 className="font-semibold text-sm">Create a MetaMask account</h3>
    <p className="text-sm text-[var(--muted)]">
      Install the MetaMask browser extension and create a wallet.
      You'll use this on the <span className="font-semibold">Sepolia</span> network to use Cyber Co.
    </p>

    <a
      href="https://metamask.io/download/"
      target="_blank"
      rel="noreferrer"
      className="btn btn-primary no-underline px-4 py-2 text-xs inline-flex items-center gap-2"
    >
      Install MetaMask Extension
      <FaChrome className="text-sm" />
    </a>
  </div>
</div>

{/* Step 2 (NEW) */}
<div className="flex gap-4">
  <div className="w-7 h-7 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)] flex items-center justify-center text-xs font-bold text-[var(--accent)]">
    2
  </div>

  <div className="space-y-2">
    <h3 className="font-semibold text-sm">Mine Sepolia test ETH</h3>
    <p className="text-sm text-[var(--muted)]">
      Get free <span className="font-semibold">SepoliaETH</span> from a faucet.
      This test currency is needed to like posts, comment, follow, and register your profile.
    </p>

    <a
      href="https://sepolia-faucet.pk910.de/"
      target="_blank"
      rel="noreferrer"
      className="btn btn-primary no-underline px-4 py-2 text-xs inline-flex items-center gap-2"
    >
      Mine test currency
    </a>
  </div>
</div>

{/* Step 3 (previously Step 2) */}
<div className="flex gap-4">
  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/80">
    3
  </div>

  <div className="space-y-2">
    <h3 className="font-semibold text-sm">Register your profile</h3>
    <p className="text-sm text-[var(--muted)]">
      After entering, connect your wallet then visit the{" "}
      <span className="font-semibold">Profile</span> tab to register.
      Once registered, you can create posts, follow others, and interact.
    </p>
  </div>
</div>

<p className="small-muted">
  You can return here anytime — this page is just an onboarding guide; your data stays on-chain.
</p>

        </div>
      </section>
    </div>
  );
}
