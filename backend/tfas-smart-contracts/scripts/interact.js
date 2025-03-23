const { ethers } = require("hardhat");
const contractAddress = require('../contract-address.json');

async function main() {
  const [signer] = await ethers.getSigners();
  const TFAS = await ethers.getContractFactory("TFAS");
  const tfas = TFAS.attach(contractAddress.address);

  // Create a project
  console.log("Creating new project...");
  const tx = await tfas.createProject("Sample Project", ethers.utils.parseEther("1"), "6 months");
  await tx.wait();

  // Get all projects
  const projects = await tfas.getProjects();
  console.log("Projects:", projects);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
