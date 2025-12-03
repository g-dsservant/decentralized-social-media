const hre = require("hardhat");

async function main() {
  const SocialFactory = await hre.ethers.getContractFactory("SocialDApp");
  const social = await SocialFactory.deploy();

  if (typeof social.waitForDeployment === "function") {
    await social.waitForDeployment();
  } else if (typeof social.deployed === "function") {
    await social.deployed();
  } else if (social.deployTransaction && social.deployTransaction.wait) {
    await social.deployTransaction.wait();
  }

  let deployedAddress = social.target ?? social.address;
  if (!deployedAddress && typeof social.getAddress === "function") {
    try {
      deployedAddress = await social.getAddress();
    } catch (e) { /* ignore */ }
  }

  console.log("SocialDApp deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});