# Decentralized Social - README

A minimal decentralized social media platform for a course project (Cryptography & Network Security).
Backend: Solidity smart contract (Hardhat).
Storage: IPFS (web3.storage).
Frontend: Next.js + Ethers.
This README walks a contributor or grader step-by-step from clone → run locally → test → (optionally) deploy to testnet.

---

## Table of contents

1. Prerequisites
2. Repository structure
3. Quick start (run locally)
4. Detailed setup (backend / frontend)
5. Environment variables (`.env` files)
6. Common tasks & commands
7. Testing & debugging tips
8. Deploy to public testnet (Sepolia)
9. Security notes & best practices
10. Contributing & contact

---

## 1. Prerequisites

* Git
* Node.js (recommended LTS: **18.x** or **20.x**)
* npm (comes with Node)
* MetaMask browser extension
* (Optional) web3.storage account for IPFS uploads: [https://web3.storage](https://web3.storage)

---

## 2. Repository structure

```
decentralized-social/
├─ contracts/
│  └─ SocialDApp.sol
├─ scripts/
│  └─ deploy.js
├─ test/
│  └─ social-test.js
├─ hardhat.config.js
├─ package.json
├─ .env
├─ frontend/
│  ├─ package.json
│  ├─ .env.local
│  ├─ constants.js
│  ├─ pages/
│  │  ├─ _app.js
│  │  ├─ index.js
│  │  └─ profile.js
│  └─ styles/globals.css
└─ README.md
```

---

## 3. Quick start — run locally

1. Clone the repo:

   ```bash
   git clone <your-repo-url>
   cd decentralized-social
   ```

2. Install root backend dependencies:

   ```bash
   npm install
   ```

3. Start local Hardhat node (Terminal A):

   ```bash
   npx hardhat node
   ```

4. Deploy contract (Terminal B):

   ```bash
   npx hardhat run --network localhost scripts/deploy.js
   ```

   Copy the printed contract address.

5. Configure frontend `.env.local`:

   ```text
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_WEB3STORAGE_TOKEN=your_web3storage_token_here
   ```

6. Start frontend (Terminal C):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. Add Hardhat account to MetaMask and use the dApp.

---

## 4. Detailed Setup

### Backend (Hardhat)

```bash
npm install
npx hardhat compile
npx hardhat node
npx hardhat run --network localhost scripts/deploy.js
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

## 5. Environment variables

### Root `.env`

```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<KEY>
PRIVATE_KEY=0x<YOUR_PRIVATE_KEY>
WEB3STORAGE_TOKEN=...
```

### Frontend `.env.local`

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_WEB3STORAGE_TOKEN=...
```

---

## 6. Common Commands

**Backend:**

```bash
npx hardhat compile
npx hardhat node
npx hardhat test
```

**Frontend:**

```bash
npm run dev
npm run build
```

---

## 7. Troubleshooting

* Ensure `_app.js` default-exports a React component.
* Always restart frontend after editing `.env.local`.
* IPFS upload issues: verify token.
* Contract errors: ensure correct address and ABI.

---

## 8. Deploy to Sepolia (Optional)

```bash
npx hardhat run --network sepolia scripts/deploy.js
```

Update frontend `.env.local` with the new address and use MetaMask on Sepolia.

---

## 9. Security Notes

* Never commit private keys.
* Use only test accounts on testnets.
* Do not upload sensitive data unencrypted to IPFS.

---

## 10. Contributing

1. Fork repo
2. Create branch
3. Commit changes
4. Submit PR

---

## Appendix — Quick Commands

```bash
git clone <url>
npm install
npx hardhat node
npx hardhat run --network localhost scripts/deploy.js
cd frontend
npm install
npm run dev
```
