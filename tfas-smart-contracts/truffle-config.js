/**
 * Use this file to configure your Truffle project. It includes settings for networks,
 * compilers, and other features like migrations and testing.
 */

// Uncomment if you want to use environment variables (e.g., for Infura deployment)
// require('dotenv').config();
// const { MNEMONIC, PROJECT_ID } = process.env;

// Uncomment if you're using @truffle/hdwallet-provider for deploying to testnets/mainnet
// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  /**
   * Networks define how you connect to your Ethereum client (e.g., Ganache, Infura).
   */
  networks: {
    // Local Ganache Network Configuration
    development: {
      host: "127.0.0.1", // Ganache host
      port: 7545,        // Ganache default port
      network_id: "*",   // Match any network ID
    },

    // Example: Goerli Testnet Configuration (Optional for future use)
    // goerli: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`),
    //   network_id: 5,       // Goerli's network ID
    //   gas: 4500000,        // Gas limit
    //   gasPrice: 10000000000, // Gas price in wei (10 gwei)
    //   confirmations: 2,    // Number of confirmations to wait between deployments
    //   timeoutBlocks: 200,  // Timeout in blocks for deployment
    //   skipDryRun: true     // Skip dry run before migrations
    // },

    // Example: Mainnet Configuration (Optional for production use)
    // mainnet: {
    //   provider: () => new HDWalletProvider(MNEMONIC, `https://mainnet.infura.io/v3/${PROJECT_ID}`),
    //   network_id: 1,       // Ethereum Mainnet's network ID
    //   gas: 6000000,        // Gas limit
    //   gasPrice: 20000000000, // Gas price in wei (20 gwei)
    //   confirmations: 2,    // Number of confirmations to wait between deployments
    //   timeoutBlocks: 200,  // Timeout in blocks for deployment
    //   skipDryRun: true     // Skip dry run before migrations
    // },
  },

  /**
   * Configure Solidity compiler settings.
   */
  compilers: {
    solc: {
      version: "0.8.0", // Specify your Solidity version (ensure it matches your contract)
      // Optional: Enable optimizer for better gas efficiency
      // settings: {
      //   optimizer: {
      //     enabled: true,
      //     runs: 200
      //   }
      // }
    }
  },

  /**
   * Mocha configuration for running tests.
   */
  mocha: {
    // timeout: 100000 // Increase timeout if needed
  },

  /**
   * Truffle DB (Optional): Store contract artifacts in a database.
   */
  // db: {
  //   enabled: false,
  //   host: "127.0.0.1",
  //   adapter: {
  //     name: "indexeddb",
  //     settings: {
  //       directory: ".db"
  //     }
  //   }
  // },

  /**
   * Plugins (Optional): Add plugins for additional functionality.
   */
  // plugins: [
  //   'truffle-plugin-verify' // For verifying contracts on Etherscan
  // ],

  /**
   * API Keys (Optional): Add API keys for services like Etherscan.
   */
  // api_keys: {
  //   etherscan: 'YOUR_ETHERSCAN_API_KEY'
  // }
};