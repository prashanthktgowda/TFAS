import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from './abi/contractABI.json'; // Ensure this path is correct
import styles from './AuditorDashboard.module.css'; // Ensure this path is correct

const AuditorDashboard = () => {
  // State Variables
  const [audits, setAudits] = useState([]); // List of audits
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

        // Load Audits
        await loadAudits(instance);
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setError('Failed to connect to the blockchain. Please check your network.');
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  // Load Audits from Smart Contract
  const loadAudits = async (instance) => {
    try {
      const auditsData = await instance.methods.getAudits().call();
      setAudits(auditsData);
    } catch (err) {
      console.error('Error fetching audits:', err);
      setError('Failed to fetch audits from the blockchain.');
    }
  };

  // Approve Milestone
  const approveMilestone = async (projectId) => {
    try {
      setLoading(true);
      setError('');

      // Call the smart contract's approveMilestone method
      await contractInstance.methods
        .approveMilestone(projectId)
        .send({ from: account });

      // Reload audits after approval
      await loadAudits(contractInstance);
    } catch (err) {
      console.error('Error approving milestone:', err);
      setError('Failed to approve the milestone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.auditorContainer}>
      {/* Header */}
      <h1>Auditor Dashboard</h1>

      {/* Error Message */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Audits List */}
      <div className={styles.auditList}>
        <h2>Audits</h2>
        {audits.length > 0 ? (
          <ul>
            {audits.map((audit, index) => (
              <li key={index}>
                <strong>{audit.projectName}</strong> - Milestone: {audit.milestone}, Status: {audit.status}
                <button onClick={() => approveMilestone(audit.projectId)} disabled={loading}>
                  {loading ? 'Approving...' : 'Approve'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No audits available.</p>
        )}
      </div>
    </div>
  );
};

export default AuditorDashboard;