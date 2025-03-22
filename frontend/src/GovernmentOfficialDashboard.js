import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from './abi/contractABI.json'; // Ensure this path is correct
import styles from './GovernmentOfficialDashboard.module.css'; // Ensure this path is correct

const GovernmentOfficialDashboard = () => {
  // State Variables
  const [projects, setProjects] = useState([]); // List of projects
  const [newProjectName, setNewProjectName] = useState(''); // Input for new project name
  const [newProjectBudget, setNewProjectBudget] = useState(''); // Input for new project budget
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

  // Create a New Project
  const createProject = async () => {
    if (!newProjectName || !newProjectBudget) {
      setError('Please provide both a project name and budget.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call the smart contract's createProject method
      await contractInstance.methods
        .createProject(newProjectName, newProjectBudget)
        .send({ from: account });

      // Reload projects after creation
      await loadProjects(contractInstance);

      // Reset input fields
      setNewProjectName('');
      setNewProjectBudget('');
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create the project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <h1>Government Official Dashboard</h1>

      {/* Error Message */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Create Project Form */}
      <div className={styles.projectForm}>
        <h2>Create New Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Budget (₹)"
          value={newProjectBudget}
          onChange={(e) => setNewProjectBudget(e.target.value)}
        />
        <button onClick={createProject} disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </div>

      {/* Ongoing Projects List */}
      <div className={styles.projectsList}>
        <h2>Ongoing Projects</h2>
        {projects.length > 0 ? (
          <ul>
            {projects.map((project, index) => (
              <li key={index}>
                <strong>{project.name}</strong> - Budget: ₹{project.budget}, Status: {project.status}
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

export default GovernmentOfficialDashboard;