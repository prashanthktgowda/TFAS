const { Web3 } = require('web3'); // Import Web3
const contractABI = require('/home/prashanthktgowda/academics_project/GFMS/TFAS/backend/tfas-smart-contracts/artifacts/contracts/TFAS.sol/TFAS.json').abi; // Correct path to ABI

// Validate environment variables
if (!process.env.BLOCKCHAIN_PROVIDER) {
  throw new Error('BLOCKCHAIN_PROVIDER is not defined in the environment variables.');
}
if (!process.env.CONTRACT_ADDRESS) {
  throw new Error('CONTRACT_ADDRESS is not defined in the environment variables.');
}

// Initialize Web3 with HTTP provider
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_PROVIDER));

// Validate contract address
const contractAddress = "0x81Fa56F8A0462d7946Db4Ed4c0654d7756DCFE9d"; // Updated contract address
if (!web3.utils.isAddress(contractAddress)) {
  throw new Error(`Invalid contract address: ${contractAddress}`);
}

// Initialize contract with validated address
let contract;
try {
  contract = new web3.eth.Contract(contractABI, contractAddress);
  console.log('Contract instance initialized successfully.');
} catch (error) {
  console.error('Error initializing contract:', error);
  throw new Error('Failed to initialize smart contract');
}

// Helper function to check if a method exists in the contract
const methodExists = (methodName) => {
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
    if (!methodExists('totalFunds')) {
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
      if (!methodExists(method)) {
        throw new Error(`Contract method "${method}" not found in ABI`);
      }
    }

    const totalFunds = await contract.methods.totalFunds().call();
    return { totalFunds };
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    throw error;
  }
};

module.exports = { web3, contract, validateBlockchain, getBlockchainData }; // Ensure the contract is exported