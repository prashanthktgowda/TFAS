const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying to Ganache network...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", "0x9B20Eb3374312715e9D47650d4DfEC0082f667Be");

  const TFAS = await hre.ethers.getContractFactory("TFAS");
  const tfas = await TFAS.deploy();
  await tfas.deployed();

  console.log("TFAS deployed to:", "0x81Fa56F8A0462d7946Db4Ed4c0654d7756DCFE9d");

  // Save contract address with network info
  const contractData = {
    address: tfas.address,
    network: "ganache",
    deployer: deployer.address,
    chainId: 1337
  };

  fs.writeFileSync(
    '../contract-address.json',
    JSON.stringify(contractData, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
