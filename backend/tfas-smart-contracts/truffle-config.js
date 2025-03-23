module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Ganache host
      port: 7545,        // Ganache default port
      network_id: "*",   // Match any network ID
      gas: 6721975,      // Optional: Increase gas limit
      gasPrice: 20000000000 // Optional: Set gas price
    },
  },

  compilers: {
    solc: {
      version: "0.8.0", // Specify your Solidity version
      settings: {
        optimizer: {
          enabled: true, // Enable optimizer for better gas efficiency
          runs: 200      // Optimize for general use cases
        }
      }
    }
  },

  mocha: {
    timeout: 100000 // Increase timeout if needed for long-running tests
  }
};