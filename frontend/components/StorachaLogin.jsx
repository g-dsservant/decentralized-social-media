"use client";
import { useState } from "react";
import { loginWithEmail, waitForAccountReady, createOrUseSpace, setSpace } from "../lib/storacha";

export default function StorachaLogin({ onReady }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function onLoginClick() {
    setStatus("Sending login email...");
    try {
      await loginWithEmail(email);
      setStatus("Login email sent — click the link in your email. Waiting for confirmation...");
      await waitForAccountReady({ interval: 1000, timeout: 600000 });
      setStatus("Authenticated. Creating/using space...");
      const { spaceDid } = await createOrUseSpace("my-social-space");
      setStatus("Space ready: " + spaceDid);
      localStorage.setItem("storacha_space", spaceDid);
      if (onReady) onReady({ spaceDid });
    } catch (err) {
      console.error(err);
      setStatus("Login failed: " + (err?.message ?? err));
    }
  }

  async function onUseExistingSpace() {
    const s = prompt("Paste the Space DID (provided by space owner):");
    if (!s) return;
    setStatus("Setting space...");
    try {
      await setSpace(s);
      localStorage.setItem("storacha_space", s);
      setStatus("Space set");
      if (onReady) onReady({ spaceDid: s });
    } catch (err) {
      console.error(err);
      setStatus("Failed to set space: " + (err?.message ?? err));
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "20px auto", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <h3>Storacha Login (required to upload)</h3>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="owner@example.com (space owner)"
        style={{ width: "100%", padding: 10, marginBottom: 8, borderRadius: 6 }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onLoginClick} style={{ padding: "8px 12px" }}>Send Login Email</button>
        <button onClick={onUseExistingSpace} style={{ padding: "8px 12px" }}>Use Existing Space DID</button>
      </div>
      <div style={{ marginTop: 10, color: status.startsWith("Error") ? "crimson" : "inherit" }}>{status}</div>
    </div>
  );
}
