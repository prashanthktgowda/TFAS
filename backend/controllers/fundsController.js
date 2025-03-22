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
exports.allocateFunds = (req, res) => {
  const { amount } = req.body;
  if (amount > totalFunds) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }
  allocatedFunds += amount;
  res.json({ message: 'Funds allocated successfully', allocatedFunds });
};

// Complete milestone
exports.completeMilestone = (req, res) => {
  const { amount } = req.body;
  if (amount > allocatedFunds) {
    return res.status(400).json({ error: 'Cannot spend more than allocated funds' });
  }
  spentFunds += amount;
  allocatedFunds -= amount;
  res.json({ message: 'Milestone completed successfully', spentFunds });
};