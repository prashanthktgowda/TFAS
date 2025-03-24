import React, { useEffect, useState, useRef } from 'react';
import Web3 from 'web3';
import contractABI from '/home/prashanthktgowda/academics_project/GFMS/TFAS/frontend/src/abi/contractABI.json'; // Ensure this path is correct
import styles from '../styles/AuditorDashboard.module.css'; // Ensure this path is correct

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Use the contract address from .env
const blockchainProvider = process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:7545'; // Default to Ganache

const AuditorDashboard = () => {
  const [projects, setProjects] = useState([]); // Ensure projects is initialized as an empty array
  const [redFlagMessage, setRedFlagMessage] = useState('');
  const [auditReports, setAuditReports] = useState([]);
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
        const projectsData = await contractInstance.current.methods.getProjects().call();
        console.log('Projects fetched:', projectsData);
        setProjects(projectsData || []); // Ensure projectsData is an array
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setError(err.message || 'Failed to connect to the blockchain.');
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  const verifyMilestone = async (projectId, milestoneId, approve) => {
    try {
      setLoading(true);
      setError('');
      if (approve) {
        await contractInstance.current.methods
          .approveMilestone(projectId, milestoneId)
          .send({ from: account.current });
        alert('Milestone approved successfully.');
      } else {
        await contractInstance.current.methods
          .rejectMilestone(projectId, milestoneId)
          .send({ from: account.current });
        alert('Milestone rejected successfully.');
      }
      const updatedProjects = await contractInstance.current.methods.getProjects().call();
      setProjects(updatedProjects || []); // Ensure updatedProjects is an array
    } catch (err) {
      console.error('Error verifying milestone:', err);
      setError('Failed to verify milestone.');
    } finally {
      setLoading(false);
    }
  };

  const raiseRedFlag = async (projectId) => {
    if (!redFlagMessage.trim()) {
      setError('Red flag message cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await contractInstance.current.methods
        .raiseRedFlag(projectId, redFlagMessage)
        .send({ from: account.current });
      alert('Red flag raised successfully.');
      setRedFlagMessage('');
    } catch (err) {
      console.error('Error raising red flag:', err);
      setError('Failed to raise red flag.');
    } finally {
      setLoading(false);
    }
  };

  const generateAuditReport = async () => {
    try {
      setLoading(true);
      setError('');
      const reports = await contractInstance.current.methods.generateAuditReports().call();
      setAuditReports(reports || []); // Ensure reports is an array
    } catch (err) {
      console.error('Error generating audit report:', err);
      setError('Failed to generate audit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Auditor Dashboard</h1>
        <p>Verify milestones, monitor compliance, and generate audit reports.</p>
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
                <p>Milestones:</p>
                <ul>
                  {project.milestones?.map((milestone) => (
                    <li key={milestone.id}>
                      {milestone.name} - Status: {milestone.status}
                      <button
                        onClick={() => verifyMilestone(project.id, milestone.id, true)}
                        disabled={loading}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => verifyMilestone(project.id, milestone.id, false)}
                        disabled={loading}
                      >
                        Reject
                      </button>
                    </li>
                  ))}
                </ul>
                <textarea
                  placeholder="Raise a red flag"
                  value={redFlagMessage}
                  onChange={(e) => setRedFlagMessage(e.target.value)}
                />
                <button onClick={() => raiseRedFlag(project.id)} disabled={loading}>
                  Raise Red Flag
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects available.</p>
        )}
      </section>

      <section className={styles.auditReportsSection}>
        <h2>Generate Audit Reports</h2>
        <button onClick={generateAuditReport} disabled={loading}>
          Generate Report
        </button>
        {auditReports.length > 0 && (
          <ul className={styles.reportList}>
            {auditReports.map((report, index) => (
              <li key={index}>{report}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AuditorDashboard;