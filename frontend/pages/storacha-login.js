// pages/storacha-login.js
"use client";
import React from "react";
import StorachaLogin from "../components/StorachaLogin";
import SiteHeader from "../components/SiteHeader";

export default function StorachaLoginPage() {
  return (
    <>
      <SiteHeader />
      <main style={{ padding: "40px 20px", maxWidth: 980, margin: "0 auto" }}>
        <h1>Storacha Login</h1>
        <p>Use the Space owner's email to send the magic link and enable uploads for this space.</p>
        <StorachaLogin />
      </main>
    </>
  );
}
