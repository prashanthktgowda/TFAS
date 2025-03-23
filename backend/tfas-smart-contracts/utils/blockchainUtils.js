const { Web3 } = require('web3');
const contractABI = require('/home/prashanthktgowda/academics_project/GFMS/TFAS/backend/tfas-smart-contracts/artifacts/contracts/TFAS.sol/TFAS.json').abi;
const fundAllocationABI = require('/home/prashanthktgowda/academics_project/GFMS/TFAS/backend/tfas-smart-contracts/artifacts/contracts/FundAllocation.sol/FundAllocation.json').abi;

// Validate environment variables
if (!process.env.BLOCKCHAIN_PROVIDER) {
  throw new Error('BLOCKCHAIN_PROVIDER is not defined in the environment variables.');
}
if (!process.env.CONTRACT_ADDRESS || !process.env.FUND_ALLOCATION_ADDRESS) {
  throw new Error('Contract addresses are not defined in the environment variables.');
}

// Initialize Web3 with HTTP provider
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_PROVIDER));

// Updated contract addresses
const contractAddress = "0xCacD7F9Ee234dEe14EaF64fe1C6118CC63C2bFD1"; // Updated TFAS contract address
const fundAllocationAddress = "0x85eBD36FA7C8B079EF609A27b7Afb858AD979E9d"; // Updated FundAllocation contract address

// Initialize contracts using updated environment variables
const tfasContract = new web3.eth.Contract(contractABI, contractAddress);
const fundAllocationContract = new web3.eth.Contract(fundAllocationABI, fundAllocationAddress);

module.exports = { web3, tfasContract, fundAllocationContract };
