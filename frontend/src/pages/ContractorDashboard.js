import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '../abi/contractABI.json'; // Correct path to ABI
import styles from '../styles/ContractorDashboard.module.css';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Updated TFAS contract address
const blockchainProvider = process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:7545'; // Default to Ganache

const ContractorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [milestoneProof, setMilestoneProof] = useState(null); // Used for file upload
  const [selectedProject, setSelectedProject] = useState(null); // Used for project selection
  const [account, setAccount] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clarification, setClarification] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState({ milestoneId: '', amount: '' });
  const [funds, setFunds] = useState({ received: 0, pending: 0 });

  const initBlockchain = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Initializing blockchain connection...');

      if (!contractAddress) {
        throw new Error('Contract address is not defined in the environment variables.');
      }
      if (!contractABI || !contractABI.abi) {
        throw new Error('Invalid ABI. Please check the ABI file.');
      }

      const web3Instance = new Web3(blockchainProvider);
      console.log('Web3 instance created:', web3Instance);

      const instance = new web3Instance.eth.Contract(contractABI.abi, contractAddress);
      setContractInstance(instance);
      console.log('Contract instance initialized:', instance);

      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No Ethereum accounts found. Please connect MetaMask or use Ganache.');
      }
      setAccount(accounts[0]);
      console.log('Connected account:', accounts[0]);

      try {
        const projectsData = await instance.methods.getProjects().call();
        console.log('Projects fetched:', projectsData);
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        throw new Error('Failed to fetch projects from the blockchain.');
      }

      try {
        if (instance.methods.getReceivedFunds) {
          console.log('Fetching received funds for account:', accounts[0]);
          const receivedFunds = await instance.methods.getReceivedFunds(accounts[0]).call();
          console.log('Received funds:', receivedFunds);
          setFunds((prevFunds) => ({ ...prevFunds, received: Web3.utils.fromWei(receivedFunds, 'ether') }));
        } else {
          console.warn('getReceivedFunds method is not available in the contract.');
        }
      } catch (err) {
        console.error('Error fetching received funds:', err);
        setError('Failed to fetch received funds. Please ensure the contract is deployed correctly.');
      }
    } catch (err) {
      console.error('Error initializing blockchain:', err);
      setError(err.message || 'Failed to connect to the blockchain.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initBlockchain();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMilestoneProof(file);
      console.log('Milestone proof file selected:', file.name);
    }
  };

  const handleProjectSelection = (project) => {
    setSelectedProject(project);
    console.log('Selected project:', project.name);
  };

  const submitMilestone = async (projectId, milestoneId) => {
    if (!milestoneProof) {
      setError('Please upload proof of milestone completion.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await contractInstance.methods
        .submitMilestone(projectId, milestoneId, milestoneProof.name) // Use file name as proof
        .send({ from: account });
      alert('Milestone submitted successfully.');
    } catch (err) {
      console.error('Error submitting milestone:', err);
      setError('Failed to submit milestone.');
    } finally {
      setLoading(false);
    }
  };

  const requestClarification = async (projectId) => {
    if (!clarification.trim()) {
      setError('Clarification message cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log(`Requesting clarification for project ID: ${projectId}`);
      await contractInstance.methods
        .requestClarification(projectId, clarification)
        .send({ from: account });
      alert('Clarification request sent successfully.');
      setClarification('');
    } catch (err) {
      console.error('Error requesting clarification:', err);
      setError('Failed to send clarification request.');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async (projectId, milestoneId, amount) => {
    if (!amount || !milestoneId) {
      setError('Please provide valid invoice details.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      console.log(`Generating invoice for Project ID: ${projectId}, Milestone ID: ${milestoneId}, Amount: ${amount}`);
      await contractInstance.methods
        .generateInvoice(projectId, milestoneId, Web3.utils.toWei(amount, 'ether'))
        .send({ from: account });
      alert('Invoice generated successfully.');
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError('Failed to generate invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1>Contractor Dashboard</h1>
        <p>Manage your projects, milestones, and invoices efficiently.</p>
      </header>

      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Loading...</p>}

      <section className={styles.fundsSection}>
        <h2>Fund Disbursement</h2>
        <p>Received Funds: ₹{funds.received} ETH</p>
        <p>Pending Funds: ₹{funds.pending} ETH</p>
      </section>

      <section className={styles.projectsSection}>
        <h2>Projects</h2>
        {projects.length > 0 ? (
          <ul className={styles.projectList}>
            {projects.map((project) => (
              <li key={project.id} className={styles.projectItem}>
                <h3>{project.name}</h3>
                <p>Budget: ₹{Web3.utils.fromWei(project.budget, 'ether')} ETH</p>
                <p>Timeline: {project.timeline}</p>
                <button onClick={() => handleProjectSelection(project)}>Select Project</button>
                <p>Milestones:</p>
                <ul>
                  {project.milestones?.map((milestone) => (
                    <li key={milestone.id}>
                      {milestone.name} - Status: {milestone.status}
                      <input type="file" onChange={handleFileUpload} />
                      <button
                        onClick={() => submitMilestone(project.id, milestone.id)}
                        disabled={loading}
                      >
                        Submit Milestone
                      </button>
                    </li>
                  ))}
                </ul>
                <textarea
                  placeholder="Request clarification"
                  value={clarification}
                  onChange={(e) => setClarification(e.target.value)}
                />
                <button onClick={() => requestClarification(project.id)} disabled={loading}>
                  Request Clarification
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects available.</p>
        )}
      </section>

      <section className={styles.invoiceSection}>
        <h2>Generate Invoice</h2>
        <input
          type="text"
          placeholder="Milestone ID"
          value={invoiceDetails.milestoneId}
          onChange={(e) =>
            setInvoiceDetails({ ...invoiceDetails, milestoneId: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Amount"
          value={invoiceDetails.amount}
          onChange={(e) =>
            setInvoiceDetails({ ...invoiceDetails, amount: e.target.value })
          }
        />
        <button
          onClick={() =>
            generateInvoice(selectedProject?.id, invoiceDetails.milestoneId, invoiceDetails.amount)
          }
          disabled={loading}
        >
          Generate Invoice
        </button>
      </section>
    </div>
  );
};

export default ContractorDashboard;