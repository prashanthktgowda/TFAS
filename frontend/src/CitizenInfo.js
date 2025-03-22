import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from './abi/contractABI.json'; // Ensure this path is correct
import styles from './CitizenInfo.module.css'; // Ensure this path is correct

const CitizenInfo = () => {
  // State Variables
  const [projects, setProjects] = useState([]); // List of projects
  const [feedback, setFeedback] = useState(''); // Feedback input
  const [contractInstance, setContractInstance] = useState(null); // Smart contract instance
  const [account, setAccount] = useState(''); // Connected Ethereum account
  const [loading, setLoading] = useState(false); // Loading state for async operations
  const [error, setError] = useState(''); // Error state for error handling

  // Initialize Blockchain Connection
  useEffect(() => {
    const initBlockchain = async () => {
      try {
        setLoading(true);
        setError('');

        // Initialize Web3
        const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545'); // Ganache RPC URL

        // Get Accounts
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          throw new Error('No Ethereum accounts found. Please connect MetaMask or use Ganache.');
        }
        setAccount(accounts[0]);

        // Initialize Contract Instance
        const instance = new web3.eth.Contract(
          contractABI,
          '0x819EAfa7f98Ee03e9F9ECD4d7f0a33A8DD937815' // Replace with your deployed contract address
        );
        setContractInstance(instance);

        // Load Projects
        await loadProjects(instance);
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setError('Failed to connect to the blockchain. Please check your network.');
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  // Load Projects from Smart Contract
  const loadProjects = async (instance) => {
    try {
      const projectsData = await instance.methods.getProjects().call();
      setProjects(projectsData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects from the blockchain.');
    }
  };

  // Submit Feedback
  const submitFeedback = async (projectId) => {
    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call the smart contract's submitFeedback method
      await contractInstance.methods
        .submitFeedback(projectId, feedback)
        .send({ from: account });

      // Reload projects after feedback submission
      await loadProjects(contractInstance);

      // Reset feedback input
      setFeedback('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.citizenContainer}>
      {/* Header */}
      <h1>Citizen Information Page</h1>
      <p>View government spending, track project progress, and provide feedback.</p>

      {/* Error Message */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Projects List */}
      <div className={styles.projectsList}>
        <h2>Ongoing Projects</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project, index) => (
              <li key={index}>
                <strong>{project.name}</strong> - Budget: ₹{project.budget}, Progress: {project.progress}%
                <textarea
                  placeholder="Provide feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button onClick={() => submitFeedback(project.id)} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects available.</p>
        )}
      </div>
    </div>
  );
};

export default CitizenInfo;