import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Web3 from 'web3';
import Home from './pages/Home';
import About from './pages/About';
import GovernmentOfficialDashboard from './pages/GovernmentOfficialDashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import CitizensPage from './pages/CitizensPage';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import contractABI from './abi/contractABI.json'; // Correct path to ABI
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        setLoading(true);
        setError('');

        // Validate environment variables
        const blockchainProvider = process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:7545';
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        if (!blockchainProvider) {
          throw new Error('REACT_APP_BLOCKCHAIN_PROVIDER is not defined.');
        }
        if (!contractAddress) {
          throw new Error('REACT_APP_CONTRACT_ADDRESS is not defined.');
        }

        // Initialize Web3
        const web3Instance = new Web3(blockchainProvider);
        setWeb3(web3Instance);

        // Get Accounts
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          throw new Error('No Ethereum accounts found. Please check Ganache or MetaMask.');
        }
        setAccount(accounts[0]);

        // Initialize Contract Instance
        const instance = new web3Instance.eth.Contract(contractABI.abi, contractAddress);
        setContractInstance(instance);

        // Validate Contract Instance
        try {
          const totalFunds = await instance.methods.totalFunds().call();
          console.log('Blockchain connection validated. Total funds:', totalFunds);
        } catch (error) {
          console.error('Error calling totalFunds:', error);
          throw new Error('Error happened while trying to execute a function inside a smart contract');
        }
      } catch (err) {
        console.error('Error initializing blockchain:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initBlockchain();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      const data = await response.json();
      console.log('Notifications:', data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="App">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <h1>Transparent Fund Allocation System (TFAS)</h1>
          <nav className="nav">
            <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}>
              Home
            </NavLink>
            <NavLink to="/about" style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}>
              About
            </NavLink>
            <NavLink
              to="/government-official-dashboard"
              style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}
            >
              Government Officials
            </NavLink>
            <NavLink
              to="/auditor-dashboard"
              style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}
            >
              Auditors
            </NavLink>
            <NavLink
              to="/contractor-dashboard"
              style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}
            >
              Contractors
            </NavLink>
            <NavLink to="/citizens" style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}>
              Citizens
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {loading && <p>Loading blockchain connection...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/government-official-dashboard"
              element={
                <GovernmentOfficialDashboard
                  web3={web3}
                  account={account}
                  contractInstance={contractInstance}
                />
              }
            />
            <Route
              path="/auditor-dashboard"
              element={
                <AuditorDashboard
                  web3={web3}
                  account={account}
                  contractInstance={contractInstance}
                />
              }
            />
            <Route
              path="/contractor-dashboard"
              element={
                <ContractorDashboard
                  web3={web3}
                  account={account}
                  contractInstance={contractInstance}
                />
              }
            />
            <Route
              path="/citizens"
              element={
                <CitizensPage
                  web3={web3}
                  account={account}
                  contractInstance={contractInstance}
                />
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 TFAS. All rights reserved.</p>
          <p>Contact us: email@example.com | Phone: +123-456-7890</p>
        </div>
      </footer>
    </div>
  );
}

export default App;