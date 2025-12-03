"use client";

import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";

export default function RegisterProfile({ onRegister }) {
  const { account } = useWallet();
  const connected = Boolean(account);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    // clear fields when wallet disconnects to avoid stale state
    if (!connected) {
      setUsername("");
      setBio("");
      setFile(null);
      setPreview("");
    }
  }, [connected]);

  function onFile(e) {
    if (!connected) return; // ignore when not connected
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  }

  function submit(e) {
    e.preventDefault();
    if (!connected) return; // safety: don't submit if not connected
    onRegister({ username: username.trim(), bio: bio.trim(), file });
    setUsername("");
    setBio("");
    setFile(null);
    setPreview("");
  }

  const formStyle = {
    maxWidth: 720,
    margin: "10px auto",
    padding: 16,
    borderRadius: 12,
    background: "#000000ff",
    boxShadow: "0 6px 18px rgba(12,12,12,0.06)",
    transition: "opacity 180ms ease, filter 180ms ease",
    opacity: connected ? 1 : 0.45,
    filter: connected ? "none" : "grayscale(0.08)",
    pointerEvents: connected ? "auto" : "none",
    userSelect: connected ? "auto" : "none",
  };

  // We still set `disabled` on each control so keyboard users / accessibility are respected.
  return (
    <form onSubmit={submit} style={formStyle} aria-disabled={!connected}>
      <h3 style={{ margin: "0 0 8px 0" }}>Connect & Register profile</h3>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        disabled={!connected}
        style={{ width: "100%", padding: 10, marginBottom: 8, borderRadius: 8, border: "1px solid #ddd" }}
      />

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Short bio"
        rows={3}
        disabled={!connected}
        style={{ width: "100%", padding: 10, marginBottom: 8, borderRadius: 8, border: "1px solid #ddd" }}
      />

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          disabled={!connected}
          aria-disabled={!connected}
        />

        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }}
          />
        ) : null}

        <button
          type="submit"
          disabled={!connected}
          style={{
            marginLeft: "auto",
            padding: "8px 14px",
            borderRadius: 8,
            background: "#0ea5a4",
            color: "#000000ff",
            border: "none",
            cursor: connected ? "pointer" : "not-allowed",
          }}
        >
          Register
        </button>
      </div>
    </form>
  );
}
