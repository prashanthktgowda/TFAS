require('dotenv').config(); // Load environment variables

const { Web3 } = require('web3'); // Import Web3
const contractABI = require('/home/prashanthktgowda/academics_project/GFMS/TFAS/backend/tfas-smart-contracts/artifacts/contracts/TFAS.sol/TFAS.json').abi; // Correct path to ABI
const fundAllocationABI = require('/home/prashanthktgowda/academics_project/GFMS/TFAS/backend/tfas-smart-contracts/artifacts/contracts/FundAllocation.sol/FundAllocation.json').abi;

// Validate environment variables
if (!process.env.BLOCKCHAIN_PROVIDER) {
  throw new Error('BLOCKCHAIN_PROVIDER is not defined in the environment variables.');
}
if (!process.env.CONTRACT_ADDRESS || !process.env.FUND_ALLOCATION_ADDRESS) {
  throw new Error('Contract addresses are not defined in the environment variables.');
}

console.log('BLOCKCHAIN_PROVIDER:', process.env.BLOCKCHAIN_PROVIDER);
console.log('CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS);
console.log('FUND_ALLOCATION_ADDRESS:', process.env.FUND_ALLOCATION_ADDRESS);

// Initialize Web3 with HTTP provider
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_PROVIDER));

// Validate contract address
const contractAddress = "0xB5487896238e3e4039cac9b41709fe3970226027"; // Updated TFAS contract address
const fundAllocationAddress = "0x420D72dF02D3cCD4b5C3a4419eAE2716E025637C"; // Updated FundAllocation contract address

if (!web3.utils.isAddress(contractAddress)) {
  throw new Error(`Invalid contract address: ${contractAddress}`);
}

// Initialize contracts
const tfasContract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);
const fundAllocationContract = new web3.eth.Contract(fundAllocationABI, process.env.FUND_ALLOCATION_ADDRESS);

// Helper function to check if a method exists in the contract
const methodExists = (contract, methodName) => {
  return contract.methods[methodName] !== undefined;
};

// Validate blockchain connection and contract instance
const validateBlockchain = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      throw new Error('No Ethereum accounts found. Please check your blockchain provider.');
    }

    // Check if contract methods exist before calling them
    if (!methodExists(tfasContract, 'totalFunds')) {
      throw new Error('Contract method "totalFunds" not found in ABI');
    }

    // Try to get the contract code at the address to verify deployment
    const code = await web3.eth.getCode(contractAddress);
    if (code === '0x' || code === '0x0') {
      throw new Error('No contract code found at the specified address');
    }

    console.log('Blockchain connection validated successfully');
    return true;
  } catch (error) {
    console.error('Error validating blockchain connection:', error);
    throw error;
  }
};

// Fetch fund data from the blockchain
const getBlockchainData = async () => {
  try {
    // Verify methods exist before calling
    const requiredMethods = ['totalFunds'];
    for (const method of requiredMethods) {
      if (!methodExists(tfasContract, method)) {
        throw new Error(`Contract method "${method}" not found in ABI`);
      }
    }

    const totalFunds = await tfasContract.methods.totalFunds().call();
    return { totalFunds };
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    throw error;
  }
};

module.exports = { web3, tfasContract, fundAllocationContract, validateBlockchain, getBlockchainData }; // Ensure the contracts are exported