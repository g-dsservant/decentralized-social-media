// lib/nft.js
// Compatibility shim: previous code used nft.storage; we now use Storacha.
// This file re-exports the old function names (uploadImageFile, uploadJSON)
// but implements them via lib/storacha so you don't need to change other code.

import * as storacha from "./storacha";

/**
 * uploadImageFile(file)
 * Legacy return: CID (string or CID object). We return the same.
 */
export async function uploadImageFile(file) {
  if (!file) throw new Error("No file provided");
  // forward to storacha.uploadFile
  const cid = await storacha.uploadFile(file);
  return cid;
}

/**
 * uploadJSON(obj, filename)
 * Legacy: returns CID of uploaded JSON.
 */
export async function uploadJSON(obj, filename = "data.json") {
  const cid = await storacha.uploadJSON(obj, filename);
  return cid;
}

/** If your app used a gateway helper, keep it named similarly */
export function getGatewayUrl(cid) {
  return storacha.gatewayUrl(cid);
}
