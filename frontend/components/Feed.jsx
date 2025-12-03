// frontend/components/Feed.jsx
"use client";

import React, { useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "../constants";
import SocialArtifact from "../SocialDApp.json";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
console.log("RPC_URL in browser:", RPC_URL);



function resolveCidUrl(cidOrIpfs) {
  if (!cidOrIpfs) return null;
  if (cidOrIpfs.startsWith("ipfs://")) {
    const raw = cidOrIpfs.replace("ipfs://", "");
    return `https://${raw}.ipfs.storacha.link`;
  }
  return `https://${cidOrIpfs}.ipfs.storacha.link`;
}

function shortAddr(addr = "") {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function Feed() {
  const { account, provider, signer } = useWallet();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load feed on mount
  useEffect(() => {
    loadFeed();
  }, []);

  // Pick correct provider
  function getReadProvider() {
  if (provider) return provider; // Wallet connected

  if (!RPC_URL) {
    throw new Error("NEXT_PUBLIC_RPC_URL is not set. Check your env vars.");
  }

  return new ethers.JsonRpcProvider(RPC_URL); // read-only Sepolia provider
}


  async function loadFeed() {
    setLoading(true);
    setError("");
    setPosts([]);

    try {
      const readProvider = getReadProvider();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        SocialArtifact.abi,
        readProvider
      );

      const countBN = await contract.postCount();
      const total = Number(countBN.toString());
      const loaded = [];

      for (let i = 1; i <= total; i++) {
        const onchain = await contract.posts(i);

        const id = Number(onchain.id || i);
        const author = onchain.author;
        const cid = onchain.contentCid?.toString();
        const timestamp = Number(onchain.timestamp);
        const likes = Number(onchain.likes);

        // Fetch metadata JSON
        let metadata = { text: "[failed]" };
        try {
          const res = await fetch(resolveCidUrl(cid));
          if (res.ok) metadata = await res.json();
        } catch {}

        // Profile
        let profile = { username: null, avatarUrl: null };
        try {
          const u = await contract.users(author);
          if (u.username) profile.username = u.username.toString();
          if (u.avatarCid && u.avatarCid.length > 0)
            profile.avatarUrl = resolveCidUrl(u.avatarCid.toString());
        } catch {}

        // Comments
        let comments = [];
        try {
          const cCountBN = await contract.commentCount(id);
          const cCount = Number(cCountBN.toString());
          for (let ci = 0; ci < cCount; ci++) {
            const c = await contract.getComment(id, ci);
            comments.push({
              author: c[0],
              text: c[1],
              timestamp: Number(c[2]),
            });
          }
        } catch {}

        // Like/follow status (only if wallet connected)
        let hasLiked = false;
        let isFollowing = false;
        try {
          if (account) {
            hasLiked = await contract.hasLiked(id, account);
            isFollowing = await contract.isFollowing(account, author);
          }
        } catch {}

        loaded.unshift({
          id,
          author,
          cid,
          timestamp,
          likes,
          metadata,
          profile,
          comments,
          hasLiked,
          isFollowing,
        });
      }

      setPosts(loaded);
    } catch (err) {
      console.error("Feed load error:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // *** WRITE ACTIONS ***

  async function doLike(postId) {
    if (!signer) return alert("Connect wallet first");

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        SocialArtifact.abi,
        signer
      );
      const tx = await contract.likePost(postId);
      await tx.wait();
      await loadFeed();
    } catch (err) {
      console.error("like error", err);
      alert(err.message || "Like failed");
    }
  }

  async function doComment(postId) {
    if (!signer) return alert("Connect wallet first");
    const text = prompt("Enter comment:");
    if (!text) return;

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        SocialArtifact.abi,
        signer
      );
      const tx = await contract.addComment(postId, text);
      await tx.wait();
      await loadFeed();
    } catch (err) {
      console.error("comment err", err);
      alert(err.message || "Comment failed");
    }
  }

  async function doFollow(addr) {
    if (!signer) return alert("Connect wallet first");

    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        SocialArtifact.abi,
        signer
      );
      const me = account;
      const currently = await contract.isFollowing(me, addr);

      const tx = currently
        ? await contract.unfollow(addr)
        : await contract.follow(addr);

      await tx.wait();
      await loadFeed();
    } catch (err) {
      console.error("follow err", err);
      alert(err.message || "Follow failed");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-3 items-center mb-5">
        <button className="btn btn-ghost" onClick={loadFeed} disabled={loading}>
          {loading ? "Loading..." : "Refresh Feed"}
        </button>
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </div>

      <div id="feedContainer">
        {posts.length === 0 && (
          <div className="text-gray-400 p-4">No posts yet.</div>
        )}

        {posts.map((p) => {
          const imageCid =
            p.metadata.image ||
            p.metadata.imageCid ||
            p.metadata.imageCID ||
            p.metadata.image_url ||
            null;

          const imageUrl = imageCid
            ? resolveCidUrl(imageCid.toString())
            : null;

          const metadataUrl = resolveCidUrl(p.cid);

          return (
            <article key={p.id} className="card mb-6">
              <div className="flex gap-4">
                <img
                  src={p.profile.avatarUrl || "/default-avatar.png"}
                  className="avatar-sm"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">
                        {p.profile.username || p.author}
                      </div>
                      <div className="small-muted">
                        {p.timestamp
                          ? new Date(p.timestamp * 1000).toLocaleString()
                          : ""}
                      </div>
                    </div>

                    <button
                      className="btn btn-ghost"
                      onClick={() => doFollow(p.author)}
                    >
                      {p.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  </div>

                  <p className="mt-3 mb-3">{p.metadata.text}</p>

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      className="w-full max-w-3xl rounded-lg border border-white/10 object-cover"
                    />
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      className="btn btn-ghost"
                      onClick={() => doLike(p.id)}
                    >
                      Like ({p.likes})
                    </button>

                    <button
                      className="btn btn-ghost"
                      onClick={() => doComment(p.id)}
                    >
                      Comment ({p.comments.length})
                    </button>

                    <a
                      href={imageUrl || metadataUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="small-muted text-accent-500 ml-2"
                    >
                      View on IPFS
                    </a>
                  </div>
                  <div className="mt-4">
                    {Array.isArray(p.comments) && p.comments.length > 0 ? (
                      <div className="space-y-3">
                        {p.comments.map((c, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#05060a] border border-white/6 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-semibold">
                                  {shortAddr(c.author)}
                                </div>
                                <div className="small-muted text-xs">
                                  {c.timestamp
                                    ? new Date(c.timestamp * 1000).toLocaleString()
                                    : ""}
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 text-sm">
                              {c.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "No Comments Yet! Feel free to comment"
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
