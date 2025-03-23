import React, { useEffect, useState, useRef } from 'react';
import Web3 from 'web3';
import contractABI from '../abi/contractABI.json'; // Correct path to ABI
import styles from '../styles/GovernmentOfficialDashboard.module.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Use the contract address from .env
const blockchainProvider = process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:7545'; // Default to Ganache

const GovernmentOfficialDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', budget: '', timeline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const contractInstance = useRef(null);
  const account = useRef(null);

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('Initializing blockchain connection...');

        // Validate environment variables
        if (!contractAddress) {
          throw new Error('Contract address is not defined in the environment variables.');
        }
        if (!contractABI || !contractABI.abi) {
          throw new Error('Invalid ABI. Please check the ABI file.');
        }

        // Initialize Web3
        const web3Instance = new Web3(blockchainProvider);
        console.log('Web3 instance created:', web3Instance);

        // Initialize Contract Instance
        contractInstance.current = new web3Instance.eth.Contract(contractABI.abi, contractAddress);
        console.log('Contract instance initialized:', contractInstance.current);

        // Get Accounts
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          throw new Error('No Ethereum accounts found. Please connect MetaMask or use Ganache.');
        }
        account.current = accounts[0];
        console.log('Connected account:', account.current);

        // Load Projects
        await loadProjects();
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setError(err.message || 'Failed to connect to the blockchain.');
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  const loadProjects = async () => {
    try {
      console.log('Fetching projects...');
      const projectsData = await contractInstance.current.methods.getProjects().call();
      console.log('Projects fetched:', projectsData);
      setProjects(projectsData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects from the blockchain.');
    }
  };

  const createProject = async () => {
    const { name, budget, timeline } = newProject;
    if (!name || !budget || !timeline) {
      setError('Please fill in all project details.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Creating new project:', newProject);

      await contractInstance.current.methods
        .createProject(name, Web3.utils.toWei(budget, 'ether'), timeline)
        .send({ from: account.current, gas: 3000000 }); // Set a higher gas limit

      console.log('Project created successfully.');
      setNewProject({ name: '', budget: '', timeline: '' });
      await loadProjects();
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const approveMilestone = async (projectId, milestoneId) => {
    try {
      setLoading(true);
      setError('');

      console.log(`Approving milestone ${milestoneId} for project ${projectId}...`);

      await contractInstance.current.methods
        .approveMilestone(projectId, milestoneId)
        .send({ from: account.current });

      console.log('Milestone approved successfully.');
      await loadProjects();
    } catch (err) {
      console.error('Error approving milestone:', err);
      setError('Failed to approve milestone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rejectMilestone = async (projectId, milestoneId) => {
    try {
      setLoading(true);
      setError('');

      console.log(`Rejecting milestone ${milestoneId} for project ${projectId}...`);

      await contractInstance.current.methods
        .rejectMilestone(projectId, milestoneId)
        .send({ from: account.current });

      console.log('Milestone rejected successfully.');
      await loadProjects();
    } catch (err) {
      console.error('Error rejecting milestone:', err);
      setError('Failed to reject milestone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Government Official Dashboard</h1>
        <p>Manage and oversee projects efficiently.</p>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading...</p>}

      {/* Create New Project */}
      <section className={styles.createProjectSection}>
        <div className={styles.projectForm}>
          <h2>Create New Project</h2>
          <div className={styles.formGroup}>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="number"
              className={styles.inputField}
              placeholder="Budget (in ETH)"
              value={newProject.budget}
              onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Timeline"
              value={newProject.timeline}
              onChange={(e) => setNewProject({ ...newProject, timeline: e.target.value })}
            />
          </div>
          <button
            className={styles.createButton}
            onClick={createProject}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </section>

      {/* Projects */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsList}>
          <h2>Projects</h2>
          {projects.length > 0 ? (
            <ul className={styles.projectItems}>
              {projects.map((project) => (
                <li key={project.id} className={styles.projectItem}>
                  <h3>{project.name}</h3>
                  <p>Budget: ₹{Web3.utils.fromWei(project.budget, 'ether')} ETH</p>
                  <p>Status: {project.status}</p>
                  <p>Timeline: {project.timeline}</p>
                  <p>Milestones:</p>
                  <ul>
                    {project.milestones?.map((milestone) => (
                      <li key={milestone.id}>
                        {milestone.name} - Status: {milestone.status}
                        <button
                          className={`${styles.milestoneButton} ${styles.approve}`}
                          onClick={() => approveMilestone(project.id, milestone.id)}
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          className={`${styles.milestoneButton} ${styles.reject}`}
                          onClick={() => rejectMilestone(project.id, milestone.id)}
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noProjects}>No projects available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default GovernmentOfficialDashboard;