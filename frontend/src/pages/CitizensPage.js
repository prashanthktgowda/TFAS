import React, { useEffect, useState, useRef } from 'react';
import Web3 from 'web3';
import contractABI from '../abi/contractABI.json'; // Correct path to ABI
import styles from '../styles/CitizensPage.module.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Use address from .env
const blockchainProvider = process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:7545'; // Default to Ganache

const CitizensPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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

        // Validate Contract Deployment
        const code = await web3Instance.eth.getCode(contractAddress);
        if (code === '0x' || code === '0x0') {
          throw new Error('No contract deployed at the specified address.');
        }
        console.log('Contract deployment validated.');

        // Load Data
        await loadProjects(contractInstance.current);
        await loadNotifications(contractInstance.current);
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setError(err.message || 'Failed to connect to the blockchain.');
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  const loadProjects = async (instance) => {
    try {
      console.log('Fetching projects...');
      const projectsData = await instance.methods.getProjects().call();
      console.log('Projects fetched:', projectsData);
      setProjects(projectsData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects from the blockchain.');
    }
  };

  const loadNotifications = async (instance) => {
    try {
      console.log('Fetching notifications...');
      const notificationsData = await instance.methods.getNotifications().call();
      console.log('Notifications fetched:', notificationsData);
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications from the blockchain.');
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedProject) {
      setError('Please select a project to provide feedback.');
      return;
    }

    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Submitting feedback for project:', selectedProject.id);

      // Call the smart contract's submitFeedback method with a higher gas limit
      await contractInstance.current.methods
        .submitFeedback(selectedProject.id, feedback)
        .send({ from: account.current, gas: 300000 }); // Increased gas limit

      console.log('Feedback submitted successfully.');

      // Reload projects after feedback submission
      await loadProjects(contractInstance.current);

      // Reset feedback input and close modal
      setFeedback('');
      setShowFeedbackModal(false);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Citizens Page</h1>
        <p>This page allows citizens to view government spending, track project progress, and provide feedback.</p>
      </header>

      {/* Error Message */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Loading Indicator */}
      {loading && <p className={styles.loading}>Loading...</p>}

      {/* Public Dashboard */}
      <section className={styles.dashboardSection}>
        <h2>Public Dashboard</h2>
        <ul className={styles.projectList}>
          {projects.map((project, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedProject(project);
                setShowFeedbackModal(true);
              }}
              className={styles.projectItem}
            >
              <strong>{project.name}</strong> - Budget: ₹{project.budget}
            </li>
          ))}
        </ul>
        {projects.length === 0 && <p className={styles.noProjects}>No projects available.</p>}
      </section>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Feedback for {selectedProject?.name}</h3>
            <textarea
              placeholder="Submit your feedback or complaint"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={styles.feedbackInput}
            />
            <div className={styles.modalActions}>
              <button
                onClick={handleFeedbackSubmit}
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <section className={styles.notificationsSection}>
        <h2>Notifications</h2>
        <ul className={styles.notificationList}>
          {notifications.map((notification, index) => (
            <li key={index} className={styles.notificationItem}>
              {notification}
            </li>
          ))}
        </ul>
        {notifications.length === 0 && <p className={styles.noNotifications}>No notifications available.</p>}
      </section>

      {/* Educational Resources */}
      <section className={styles.resourcesSection}>
        <h2>Educational Resources</h2>
        <p>Learn how blockchain ensures transparency and accountability.</p>
        <a href="https://example.com/blockchain-resources" target="_blank" rel="noopener noreferrer">
          Learn More
        </a>
      </section>
    </div>
  );
};

export default CitizensPage;