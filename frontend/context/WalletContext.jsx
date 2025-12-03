"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.ethereum) {
      const p = new BrowserProvider(window.ethereum);
      setProvider(p);

      const handleAccounts = async (accounts) => {
        if (!accounts || accounts.length === 0) {
          setAccount(null);
          setSigner(null);
        } else {
          setAccount(accounts[0]);
          try {
            const s = await p.getSigner();
            setSigner(s);
          } catch {
            setSigner(null);
          }
        }
      };

      const handleChain = () => {};

      window.ethereum.on("accountsChanged", handleAccounts);
      window.ethereum.on("chainChanged", handleChain);

      setReady(true);

      return () => {
        try {
          window.ethereum.removeListener("accountsChanged", handleAccounts);
          window.ethereum.removeListener("chainChanged", handleChain);
        } catch {}
      };
    } else {
      setReady(true);
    }
  }, []);

  async function connect() {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("No wallet found");
      return;
    }

    try {
      const accs = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accs || accs.length === 0) throw new Error("No account returned");

      const addr = accs[0];

      let p = provider;
      if (!p) {
        p = new BrowserProvider(window.ethereum);
        setProvider(p);
      }

      const s = await p.getSigner();
      setSigner(s);
      setAccount(addr);

      return addr;
    } catch (e) {
      console.error("connect err", e);
      throw e;
    }
  }

  function disconnect() {
    setAccount(null);
    setSigner(null);
  }

  return (
    <WalletContext.Provider
      value={{ provider, signer, account, ready, connect, disconnect }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
