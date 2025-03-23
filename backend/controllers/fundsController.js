const { getBlockchainData } = require('../utils/blockchainUtils');

// Mock data for demonstration
let totalFunds = 1000000;
let allocatedFunds = 0;
let spentFunds = 0;

// Get fund details
exports.getFunds = async (req, res) => {
  try {
    const blockchainData = await getBlockchainData(); // Fetch data from blockchain
    res.json({
      totalFunds: blockchainData.totalFunds || totalFunds,
      allocatedFunds: blockchainData.allocatedFunds || allocatedFunds,
      spentFunds: blockchainData.spentFunds || spentFunds,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fund details' });
  }
};

// Allocate funds
exports.allocateFunds = async (req, res) => {
  const { amount } = req.body;
  try {
    // Interact with the blockchain to allocate funds
    await contract.methods.allocateFunds(amount).send({ from: process.env.ADMIN_ACCOUNT });
    res.json({ message: 'Funds allocated successfully' });
  } catch (error) {
    console.error('Error allocating funds:', error);
    res.status(500).json({ error: 'Failed to allocate funds' });
  }
};

// Complete milestone
exports.completeMilestone = async (req, res) => {
  const { amount } = req.body;
  try {
    // Interact with the blockchain to complete a milestone
    await contract.methods.completeMilestone(amount).send({ from: process.env.ADMIN_ACCOUNT });
    res.json({ message: 'Milestone completed successfully' });
  } catch (error) {
    console.error('Error completing milestone:', error);
    res.status(500).json({ error: 'Failed to complete milestone' });
  }
};