const contract = require('../utils/blockchainUtils').contract;

exports.submitFeedback = async (req, res) => {
  const { projectId, feedback } = req.body;
  try {
    await contract.methods.submitFeedback(projectId, feedback).send({ from: process.env.ADMIN_ACCOUNT });
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
