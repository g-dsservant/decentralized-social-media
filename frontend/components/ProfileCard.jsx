// frontend/components/ProfileCard.jsx
import { useState } from "react";

export default function ProfileCard({ profile, onUpdate, onDelete }) {
  const imgSrc =
    profile?.avatarCid && profile.avatarCid !== "pending"
      ? `https://ipfs.io/ipfs/${profile.avatarCid}`
      : "/default-avatar.png";

  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // keep local form values in sync when profile prop changes
  // (parent may update after onUpdate)
  useState(() => {
    setUsername(profile?.username || "");
    setBio(profile?.bio || "");
  });

  function onFile(e) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  }

  async function submitUpdate(e) {
    e.preventDefault();
    if (!onUpdate) return;
    try {
      setBusy(true);
      setMsg("Updating...");
      await onUpdate({ username: username.trim(), bio: bio.trim(), file });
      setMsg("Updated.");
      setEditing(false);
      setFile(null);
      setPreview("");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      console.error("update failed", err);
      setMsg("Update failed");
      setTimeout(() => setMsg(""), 3000);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) return;
    if (!confirm("Delete your profile? This will clear username/bio/avatar.")) return;
    try {
      setBusy(true);
      setMsg("Deleting profile...");
      await onDelete();
      setMsg("Deleted.");
      setEditing(false);
    } catch (err) {
      console.error("delete failed", err);
      setMsg("Delete failed");
      setTimeout(() => setMsg(""), 3000);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        background: "#000000ff",
        boxShadow: "0 8px 20px rgba(12,12,12,0.06)",
        maxWidth: 900,
        position: "relative",
      }}
    >
      <img
        src={imgSrc}
        alt="avatar"
        style={{ width: 96, height: 96, borderRadius: 12, objectFit: "cover" }}
      />

      <div style={{ flex: 1 }}>
        {!editing ? (
          <>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{profile?.username || "No Profile"}</div>
            <div style={{ color: "#666", marginTop: 6 }}>{profile?.bio || "Create a profile."}</div>
          </>
        ) : (
          <form onSubmit={submitUpdate}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  minWidth: 180,
                }}
                disabled={busy}
              />
              <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                />
              ) : null}
            </div>

            <div style={{ marginTop: 8 }}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="Short bio"
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
                disabled={busy}
              />
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button
                type="submit"
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: "#0ea5a4",
                  color: "#fff",
                  cursor: busy ? "not-allowed" : "pointer",
                }}
                disabled={busy}
              >
                {busy ? "Working..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFile(null);
                  setPreview("");
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid #444",
                  background: "transparent",
                  color: "#fff",
                }}
                disabled={busy}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                style={{
                  marginLeft: "auto",
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "none",
                  background: "#ef4444",
                  color: "#fff",
                }}
                disabled={busy}
              >
                Delete profile
              </button>
            </div>

            {msg ? <div style={{ marginTop: 8, color: "#ccc" }}>{msg}</div> : null}
          </form>
        )}
      </div>

      {/* edit button on the right */}
      <div style={{ marginLeft: 8 }}>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              background: "#0ea5a4",
              color: "#000000ff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Edit profile
          </button>
        ) : null}
      </div>
    </div>
  );
}
