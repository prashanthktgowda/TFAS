const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying to Ganache network...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const TFAS = await hre.ethers.getContractFactory("TFAS");
  const tfas = await TFAS.deploy();
  await tfas.deployed();
  console.log("TFAS deployed to:", tfas.address);

  const FundAllocation = await hre.ethers.getContractFactory("FundAllocation");
  const fundAllocation = await FundAllocation.deploy();
  await fundAllocation.deployed();
  console.log("FundAllocation deployed to:", fundAllocation.address);

  // Save contract addresses
  const contractData = {
    tfasAddress: "0xCacD7F9Ee234dEe14EaF64fe1C6118CC63C2bFD1", // Updated TFAS address
    fundAllocationAddress: "0x85eBD36FA7C8B079EF609A27b7Afb858AD979E9d", // Updated FundAllocation address
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
