import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '../abi/contractABI.json'; // Correct path to ABI
import styles from '../styles/CitizenDashboard.module.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // TFAS contract address
const fundAllocationAddress = process.env.REACT_APP_FUND_ALLOCATION_ADDRESS; // FundAllocation contract address
const blockchainProvider = process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:7545'; // Default to Ganache

const CitizenDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [educationalResources, setEducationalResources] = useState([]);
  const [irregularityReport, setIrregularityReport] = useState('');
  const [account, setAccount] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        const instance = new web3Instance.eth.Contract(contractABI.abi, contractAddress);
        setContractInstance(instance);
        console.log('Contract instance initialized:', instance);

        // Get Accounts
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          throw new Error('No Ethereum accounts found. Please connect MetaMask or use Ganache.');
        }
        setAccount(accounts[0]);
        console.log('Connected account:', accounts[0]);

        // Load Projects and Notifications
        const projectsData = await instance.methods.getProjects().call();
        const notificationsData = await instance.methods.getNotifications().call();
        setProjects(projectsData);
        setNotifications(notificationsData);

        // Load Educational Resources (mock data for now)
        setEducationalResources([
          { title: 'What is Blockchain?', link: '/resources/blockchain' },
          { title: 'How TFAS Works', link: '/resources/tfas' },
          { title: 'FAQs', link: '/resources/faqs' },
        ]);
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setError('Failed to connect to the blockchain.');
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  const submitFeedback = async (projectId) => {
    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log(`Submitting feedback for project ID: ${projectId}`);
      await contractInstance.methods
        .submitFeedback(projectId, feedback)
        .send({ from: account });
      alert('Feedback submitted successfully.');
      setFeedback('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  const reportIrregularity = async (projectId) => {
    if (!irregularityReport.trim()) {
      setError('Irregularity report cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log(`Reporting irregularity for project ID: ${projectId}`);
      await contractInstance.methods
        .addNotification(`Irregularity reported for project ID ${projectId}: ${irregularityReport}`)
        .send({ from: account });
      alert('Irregularity reported successfully.');
      setIrregularityReport('');
    } catch (err) {
      console.error('Error reporting irregularity:', err);
      setError('Failed to report irregularity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Citizen Dashboard</h1>
        <p>Track public projects, provide feedback, and learn about TFAS.</p>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading...</p>}

      <section className={styles.projectsSection}>
        <h2>Ongoing Projects</h2>
        {projects.length > 0 ? (
          <ul className={styles.projectList}>
            {projects.map((project) => (
              <li key={project.id} className={styles.projectItem}>
                <h3>{project.name}</h3>
                <p>Budget: ₹{Web3.utils.fromWei(project.budget, 'ether')} ETH</p>
                <p>Timeline: {project.timeline}</p>
                <p>Progress: {project.progress || 'N/A'}%</p>
                <textarea
                  placeholder="Provide feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <button onClick={() => submitFeedback(project.id)} disabled={loading}>
                  Submit Feedback
                </button>
                <textarea
                  placeholder="Report irregularity"
                  value={irregularityReport}
                  onChange={(e) => setIrregularityReport(e.target.value)}
                />
                <button onClick={() => reportIrregularity(project.id)} disabled={loading}>
                  Report Irregularity
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects available.</p>
        )}
      </section>

      <section className={styles.notificationsSection}>
        <h2>Notifications</h2>
        {notifications.length > 0 ? (
          <ul className={styles.notificationList}>
            {notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        ) : (
          <p>No notifications available.</p>
        )}
      </section>

      <section className={styles.educationalResourcesSection}>
        <h2>Educational Resources</h2>
        <ul className={styles.resourceList}>
          {educationalResources.map((resource, index) => (
            <li key={index}>
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                {resource.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CitizenDashboard;
