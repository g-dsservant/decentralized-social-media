"use client";

import { useState } from "react";
import { uploadFile, uploadJSON } from "../lib/storacha";
import { getContract } from "../lib/ethers";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  function onFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview("");
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!text.trim() && !file) {
      setStatus("Enter text or choose an image.");
      return;
    }
    setLoading(true);
    setStatus("Uploading image (if any)...");
    try {
      let imageCID = "";
      if (file) {
        const rawCid = await uploadFile(file);
        imageCID = rawCid.toString();
      }

      setStatus("Uploading post metadata...");
      const metadata = { text: text.trim(), imageCID, timestamp: Date.now() };
      const jsonCid = await uploadJSON(metadata);
      const cid = jsonCid.toString();

      setStatus("Sending transaction to contract (if available)...");
      let txHash = null;
      try {
        const contract = await getContract();
        const tx = await contract.createPost(cid);
        await tx.wait();
        txHash = tx.hash;
      } catch (contractErr) {
        console.warn("Contract call skipped/failed:", contractErr);
      }

      setStatus(`Success. CID: ${cid}${txHash ? ` tx: ${txHash}` : ""}`);
      setText("");
      setFile(null);
      setPreview("");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + (err?.message ?? "upload failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCreatePost} style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
        rows={4}
        style={{ padding: 12, fontSize: 16, resize: "vertical" }}
      />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input type="file" accept="image/*" onChange={onFileChange} />
        {preview ? (
          <img src={preview} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Working..." : "Create Post"}
        </button>

      </div>
      <div style={{ minHeight: 20, fontSize: 14 }}>{status}</div>
    </form>
  );
}
