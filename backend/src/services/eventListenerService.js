const { ethers } = require('ethers');
const db = require('../database');
const BlockchainService = require('./blockchainService'); // Correct path

class EventListenerService {
  constructor() {
    this.blockchainService = BlockchainService;
  }

  async startListening() {
    // Listen for contract events
    this.blockchainService.listenToContractEvents();

    // Sync projects periodically
    setInterval(async () => {
      await this.blockchainService.syncProjectsToDatabase(db);
    }, 5 * 60 * 1000); // Sync every 5 minutes
  }
}

module.exports = new EventListenerService();
