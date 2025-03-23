const { contract } = require('../utils/blockchainUtils');

exports.getNotifications = async (req, res) => {
  try {
    if (!contract || !contract.methods) {
      throw new Error('Contract instance is not initialized.');
    }

    const notifications = await contract.methods.getNotifications().call();
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};
