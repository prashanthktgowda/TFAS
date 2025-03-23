const { ethers } = require("ethers");
const contractAddress = {
  address: "0x81Fa56F8A0462d7946Db4Ed4c0654d7756DCFE9d", // Updated contract address
};
const TFAS = require('../artifacts/contracts/TFAS.sol/TFAS.json'); // Correct path

class ContractHelper {
  constructor(provider) {
    this.provider = provider || new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
    this.contract = new ethers.Contract(
      contractAddress.address,
      TFAS.abi,
      this.provider
    );
  }

  async createProject(name, budget, timeline, signer) {
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.createProject(name, budget, timeline);
  }

  async getProjects() {
    return await this.contract.getProjects();
  }

  // Add Ganache-specific helper
  async connectToGanache() {
    try {
      await this.provider.getNetwork();
      return true;
    } catch (error) {
      console.error("Failed to connect to Ganache:", error);
      return false;
    }
  }

  // Add more methods as needed
}

module.exports = ContractHelper;
