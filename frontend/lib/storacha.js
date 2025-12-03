// frontend/lib/storacha.js
import { create } from "@storacha/client";

let client = null;
let account = null;
let currentSpaceDid = null;

export async function initClient() {
  if (client) return client;
  client = await create();

  // Try env first
  const envSpace = process.env.NEXT_PUBLIC_STORACHA_SPACE_DID;
  if (envSpace) {
    try {
      await client.setCurrentSpace(envSpace);
      currentSpaceDid = envSpace;
      console.log("Storacha: space set from env:", envSpace);
      return client;
    } catch (err) {
      console.warn("Storacha: failed to set space from env:", err);
    }
  }

  // Try localStorage next (browser only)
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("storacha_space");
    if (saved) {
      try {
        await client.setCurrentSpace(saved);
        currentSpaceDid = saved;
        console.log("Storacha: space set from localStorage:", saved);
        return client;
      } catch (err) {
        console.warn("Storacha: failed to set space from localStorage:", err);
      }
    }
  }

  console.warn("Storacha: No space set. Uploads will fail until a space is configured.");
  return client;
}

/** Email login flow - sends the magic link email */
export async function loginWithEmail(email) {
  if (!email) throw new Error("loginWithEmail requires an email");
  if (!client) await initClient();
  // returns an account-like promise that resolves after the user clicks the link
  account = await client.login(email);
  return account;
}

/** Wait for the account that was returned by loginWithEmail to be ready (clicked & plan selected) */
export async function waitForAccountReady({ interval = 1000, timeout = 10 * 60 * 1000 } = {}) {
  if (!account) throw new Error("No account promise found. Call loginWithEmail first.");
  await account.plan.wait({ interval, timeout });
  return account;
}

/** Create a new space or return an existing one with that name (convenience) */
export async function createOrUseSpace(name, opts = {}) {
  if (!client) await initClient();
  if (!account) {
    // if no account, try to use env/localspace first
    const envSpace = process.env.NEXT_PUBLIC_STORACHA_SPACE_DID;
    if (envSpace) {
      await setSpace(envSpace);
      return { spaceDid: envSpace };
    }
    throw new Error("No authenticated account. Call loginWithEmail first or set env space.");
  }

  // try create, fallback to listing spaces
  try {
    const space = await client.createSpace(name, { account });
    const did = space.did();
    await client.setCurrentSpace(did);
    currentSpaceDid = did;
    return { spaceDid: did, space };
  } catch (err) {
    // try to find an existing space
    try {
      const spaces = await client.listSpaces?.({ account }) || [];
      const found = spaces.find(s => s.name === name) || spaces[0];
      if (!found) throw err;
      const did = found.did();
      await client.setCurrentSpace(did);
      currentSpaceDid = did;
      return { spaceDid: did, space: found };
    } catch (err2) {
      throw err;
    }
  }
}

/** Manually set a space DID at runtime (used by StorachaLogin "Use Existing Space DID") */
export async function setSpace(spaceDid) {
  if (!client) await initClient();
  await client.setCurrentSpace(spaceDid);
  currentSpaceDid = spaceDid;
  if (typeof window !== "undefined") localStorage.setItem("storacha_space", spaceDid);
  console.log("Storacha: manually set space:", spaceDid);
}

/** Upload a File/Blob */
export async function uploadFile(file) {
  if (!client) await initClient();
  if (!currentSpaceDid) throw new Error("Storacha: No space set (missing DID?)");
  const cid = await client.uploadFile(file);
  return cid;
}

/** Upload a JSON object (wraps into a File and uploads) */
export async function uploadJSON(obj, filename = "data.json") {
  const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });
  const file = new File([blob], filename, { type: "application/json" });
  return uploadFile(file);
}

/** Build a gateway URL for public access to CID */
export function gatewayUrl(cid) {
  return `https://${cid}.ipfs.storacha.link`;
}
