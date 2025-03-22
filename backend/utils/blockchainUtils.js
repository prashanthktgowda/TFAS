const Web3 = require('web3');

// Connect to Ganache
const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER);

// Load the smart contract ABI and address
const contractABI = require('../smart-contracts/FundAllocation.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Fetch fund data from the blockchain
exports.getBlockchainData = async () => {
  try {
    const totalFunds = await contract.methods.totalFunds().call();
    const allocatedFunds = await contract.methods.allocatedFunds().call();
    const spentFunds = await contract.methods.spentFunds().call();
    return { totalFunds, allocatedFunds, spentFunds };
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    throw error;
  }
};