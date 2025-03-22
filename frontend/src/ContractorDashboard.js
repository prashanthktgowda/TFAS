import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from './abi/contractABI.json'; // Ensure this path is correct
import styles from './ContractorDashboard.module.css'; // Ensure this path is correct

const ContractorDashboard = () => {
  // State Variables
  const [tasks, setTasks] = useState([]); // List of tasks
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
        const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545'); // Ganache RPC URL

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

        // Load Tasks
        await loadTasks(instance);
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setError('Failed to connect to the blockchain. Please check your network.');
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  // Load Tasks from Smart Contract
  const loadTasks = async (instance) => {
    try {
      const tasksData = await instance.methods.getTasks().call();
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks from the blockchain.');
    }
  };

  // Submit Milestone
  const submitMilestone = async (taskId) => {
    try {
      setLoading(true);
      setError('');

      // Call the smart contract's submitMilestone method
      await contractInstance.methods
        .submitMilestone(taskId)
        .send({ from: account });

      // Reload tasks after submission
      await loadTasks(contractInstance);
    } catch (err) {
      console.error('Error submitting milestone:', err);
      setError('Failed to submit the milestone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contractorContainer}>
      {/* Header */}
      <h1>Contractor Dashboard</h1>

      {/* Error Message */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Tasks List */}
      <div className={styles.tasksList}>
        <h2>Tasks</h2>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                <strong>{task.projectName}</strong> - Milestone: {task.milestone}, Status: {task.status}
                <button onClick={() => submitMilestone(task.id)} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Milestone'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;