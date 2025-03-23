const { tfasContract } = require('../utils/blockchainUtils');

exports.getNotifications = async (req, res) => {
  try {
    // Ensure the contract instance is initialized
    if (!tfasContract || !tfasContract.methods) {
      throw new Error('Contract instance is not initialized.');
    }

    // Fetch notifications from the contract
    const notifications = await tfasContract.methods.getNotifications().call();
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};
