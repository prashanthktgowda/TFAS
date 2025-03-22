import React, { useEffect, useState, useRef } from 'react';
import Web3 from 'web3';
import contractABI from './abi/contractABI.json'; // Import the ABI

// Replace with your actual contract address
const contractAddress = '0x8f09FCEDD8e6A6EC52b7604f8B34bfAC11154727';

const CitizensPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const contractInstance = useRef(null); // Use useRef to preserve value
  const account = useRef(null); // Use useRef to preserve value

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        setLoading(true);
        setError('');

        // Initialize Web3
        const web3Instance = new Web3(Web3.givenProvider || 'http://localhost:8545');

        // Initialize Contract Instance
        contractInstance.current = new web3Instance.eth.Contract(contractABI, contractAddress);

        // Get Accounts
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          throw new Error('No Ethereum accounts found. Please connect MetaMask or use Ganache.');
        }
        account.current = accounts[0];

        // Load Data
        await loadProjects(contractInstance.current);
        await loadNotifications(contractInstance.current);
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setError('Failed to connect to the blockchain. Please check your network.');
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  const loadProjects = async (instance) => {
    try {
      const projectsData = await instance.methods.getProjects().call();
      setProjects(projectsData);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects from the blockchain.');
    }
  };

  const loadNotifications = async (instance) => {
    try {
      const notificationsData = await instance.methods.getNotifications().call();
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

      // Call the smart contract's submitFeedback method
      await contractInstance.current.methods
        .submitFeedback(selectedProject.id, feedback)
        .send({ from: account.current });

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
    <div>
      {/* Header */}
      <h1>Citizens Page</h1>
      <p>This page is designed for the general public to view government spending, track project progress, and provide feedback.</p>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Public Dashboard */}
      <h2>Public Dashboard</h2>
      <ul>
        {projects.map((project, index) => (
          <li
            key={index}
            onClick={() => {
              setSelectedProject(project);
              setShowFeedbackModal(true);
            }}
            style={{ cursor: 'pointer', marginBottom: '10px' }}
          >
            {project.name} - Budget: ₹{project.budget}
          </li>
        ))}
      </ul>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <h3>Feedback for {selectedProject?.name}</h3>
          <textarea
            placeholder="Submit your feedback or complaint"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          />
          <button
            onClick={handleFeedbackSubmit}
            disabled={loading}
            style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              marginRight: '10px',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button
            onClick={() => setShowFeedbackModal(false)}
            style={{
              background: '#ccc',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Notifications */}
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>

      {/* Educational Resources */}
      <h2>Educational Resources</h2>
      <p>Learn how blockchain ensures transparency and accountability.</p>
    </div>
  );
};

export default CitizensPage;