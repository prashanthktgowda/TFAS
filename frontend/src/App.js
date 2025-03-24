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
import contractABI from './abi/contractABI.json';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
const BLOCKCHAIN_PROVIDER = process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0xca8F8Df5676EF8Fb2B2dcc45e696020339670dB0'; // Ensure consistency

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

        if (!BLOCKCHAIN_PROVIDER || !CONTRACT_ADDRESS) {
          throw new Error('Blockchain provider or contract address is not defined.');
        }

        const web3Instance = new Web3(BLOCKCHAIN_PROVIDER);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          throw new Error('No Ethereum accounts found. Please check Ganache or MetaMask.');
        }
        setAccount(accounts[0]);

        const instance = new web3Instance.eth.Contract(contractABI.abi, CONTRACT_ADDRESS);
        setContractInstance(instance);

        try {
          if (instance.methods.getTotalFunds) {
            const totalFunds = await instance.methods.getTotalFunds().call();
            console.log('Total funds:', totalFunds);
          } else {
            console.warn('getTotalFunds method is not available in the contract.');
          }
        } catch (error) {
          console.error('Error calling getTotalFunds:', error.message);
          setError('Failed to fetch total funds. Please ensure the blockchain is running.');
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
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Notifications:', data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications. Please ensure the backend server is running.');
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
          <h1>TFAS</h1>
          <nav className="nav">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about">
              About
            </NavLink>
            <NavLink to="/government-official-dashboard">
              Officials
            </NavLink>
            <NavLink to="/auditor-dashboard">
              Auditors
            </NavLink>
            <NavLink to="/contractor-dashboard">
              Contractors
            </NavLink>
            <NavLink to="/citizens">
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
            <Route
              path="/signup"
              element={<Signup contractInstance={contractInstance} account={account} />}
            />
            <Route
              path="/signin"
              element={<Signin contractInstance={contractInstance} account={account} />}
            />
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