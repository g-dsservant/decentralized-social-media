"use client";
import React, { useEffect } from "react";
import "../styles/globals.css";
import SiteHeader from "../components/SiteHeader";
import { initClient } from "../lib/storacha";
import { WalletProvider } from "../context/WalletContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const hideHeader = router.pathname === "/"; // no header on welcome page

  useEffect(() => {
    (async () => {
      try {
        await initClient();
        console.log("Storacha client initialized");
      } catch (err) {
        console.error("Storacha init failed:", err);
      }
    })();
  }, []);

  return (
    <WalletProvider>
      {!hideHeader && <SiteHeader />}
      <Component {...pageProps} />
    </WalletProvider>
  );
}
