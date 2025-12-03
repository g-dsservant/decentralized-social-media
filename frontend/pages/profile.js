"use client";

import { useState } from "react";
import RegisterProfile from "../components/RegisterProfile";
import ProfileCard from "../components/ProfileCard";
import { uploadImageFile } from "../lib/nft";
import { getContract } from "../lib/ethers";
import { useWallet } from "../context/WalletContext";

// resizeImage helper kept as-is (same as your original)
async function resizeImage(file, maxWidth = 1200, quality = 0.8) {
  if (!file || !file.type.startsWith("image/")) return file;
  const img = document.createElement("img");

  const dataUrl = await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

  await new Promise((resolve) => { img.onload = resolve; img.src = dataUrl; });

  const ratio = img.width / img.height;
  let w = img.width;
  let h = img.height;

  if (w > maxWidth) {
    w = maxWidth;
    h = Math.round(maxWidth / ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);

  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
  );

  return new File([blob], "avatar.jpg", { type: "image/jpeg" });
}

export default function ProfilePage() {
  const { account, connect } = useWallet();        // ← use global wallet
  const [profile, setProfile] = useState(null);
  const [avatarCid, setAvatarCid] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleRegister({ username, bio, file }) {
    setLoading(true);
    setStatus("Preparing profile...");

    try {
      let imageCID = avatarCid || "";

      if (file) {
        setStatus("Resizing avatar...");
        const resized = await resizeImage(file);

        setStatus("Uploading avatar to IPFS...");
        const raw = await uploadImageFile(resized);
        imageCID = raw.toString?.() || raw;
        setAvatarCid(imageCID);
      }

      setStatus("Sending profile to blockchain...");
      try {
        const contract = await getContract();
        const tx = await contract.register(username, bio, imageCID);
        await tx.wait();
        setStatus("Profile registered on-chain.");
      } catch (err) {
        console.warn("On-chain register failed:", err);
        setStatus("Saved locally (wallet not connected).");
      }

      setProfile({ username, bio, avatarCid: imageCID, registered: true });
    } catch (e) {
      console.error(e);
      setStatus("Error: " + (e?.message || e));
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  }

  async function loadProfile() {
    if (!account) {
      setStatus("Connect wallet first.");
      return;
    }

    setStatus("Loading profile...");

    try {
      const contract = await getContract().catch(() => null);
      if (!contract) {
        setStatus("Wallet not connected.");
        return;
      }

      const u = await contract.getUser(account);

      setProfile({
        username: u[0],
        bio: u[1],
        avatarCid: u[2],
        registered: !!u[3],
      });

      setStatus("");
    } catch (e) {
      console.error(e);
      setStatus("Error loading profile");
    }
  }

  // -------------- NEW: update profile -----------------
  async function handleUpdateProfile({ username, bio, file }) {
    setLoading(true);
    setStatus("Updating profile...");

    try {
      let imageCID = profile?.avatarCid || "";

      if (file) {
        setStatus("Resizing avatar...");
        const resized = await resizeImage(file);
        setStatus("Uploading avatar to IPFS...");
        const raw = await uploadImageFile(resized);
        imageCID = raw.toString?.() || raw;
        setAvatarCid(imageCID);
      }

      // attempt on-chain update
      try {
        const contract = await getContract();
        if (contract) {
          const tx = await contract.updateProfile(username, bio, imageCID);
          await tx.wait();
          setStatus("Profile updated on-chain.");
        } else {
          throw new Error("No contract");
        }
      } catch (err) {
        console.warn("On-chain update failed:", err);
        setStatus("Updated locally (not enough funds).");
      }

      // update UI
      setProfile({ username, bio, avatarCid: imageCID, registered: true });
    } catch (e) {
      console.error(e);
      setStatus("Error updating profile");
      throw e; // rethrow for caller UI to handle
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 2500);
    }
  }

  // -------------- NEW: delete profile -----------------
  async function handleDeleteProfile() {
    setLoading(true);
    setStatus("Deleting profile...");

    try {
      // contract has no explicit delete; clear on-chain by setting empty values
      try {
        const contract = await getContract();
        if (contract) {
          const tx = await contract.updateProfile("", "", "");
          await tx.wait();
          setStatus("Profile cleared on-chain.");
        } else {
          throw new Error("No contract");
        }
      } catch (err) {
        console.warn("On-chain delete/clear failed:", err);
        setStatus("Cleared locally (wallet not connected).");
      }

      // update UI: clear profile
      setProfile(null);
      setAvatarCid("");
    } catch (e) {
      console.error(e);
      setStatus("Error deleting profile");
      throw e;
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 2500);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Profile</h1>

      {/* ------------------- REGISTER FORM ------------------- */}
      <RegisterProfile onRegister={handleRegister} />

      {/* ------------------- TOOLS ---------------------------- */}
      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
        {!account ? (
          <button onClick={() => connect()} className="btn btn-primary">
            Connect Wallet
          </button>
        ) : (
          <button onClick={loadProfile} className="btn btn-ghost">
            Load my profile
          </button>
        )}

        <span style={{ color: "#aaa", marginLeft: 12 }}>
          {account ? `Connected: ${account.slice(0,6)}...${account.slice(-4)}` : "Wallet not connected"}
        </span>
      </div>

      {/* ------------------- PROFILE CARD ---------------------- */}
      <div style={{ marginTop: 20 }}>
        <h2>Your profile card</h2>
        {profile ? (
          <ProfileCard profile={profile} onUpdate={handleUpdateProfile} onDelete={handleDeleteProfile} />
        ) : (
          <div>No profile yet. Register above.</div>
        )}
      </div>

      {status ? <div style={{ marginTop: 12, color: "#ccc" }}>{status}</div> : null}
      {loading ? <div style={{ marginTop: 8 }}>Working...</div> : null}
    </main>
  );
}
