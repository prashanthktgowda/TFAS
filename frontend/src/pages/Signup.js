import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import UserManagementABI from '../abi/UserManagement.json'; // Import the ABI
import './Signup.css';

const Signup = () => {
  const [role, setRole] = useState('official'); // Default role
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const initBlockchain = async () => {
      try {
        const web3 = new Web3(process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:7545');
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contract = new web3.eth.Contract(
          UserManagementABI.abi,
          process.env.REACT_APP_CONTRACT_ADDRESS || '0xca8F8Df5676EF8Fb2B2dcc45e696020339670dB0' // Ensure consistency
        );
        setContractInstance(contract);
      } catch (err) {
        console.error('Error initializing blockchain:', err);
        setMessage('Failed to connect to the blockchain.');
      }
    };

    initBlockchain();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      console.log('Contract Instance:', contractInstance);
      console.log('Available Methods:', contractInstance.methods);

      console.log(`Signing up as ${role} with email: ${email}`);

      // Call the blockchain function to register the user
      await contractInstance.methods
        .registerUser(email, role)
        .send({ from: account, gas: 3000000 });

      setMessage('Signup successful! Awaiting approval from officials.');
    } catch (err) {
      console.error('Error during signup:', err);
      setMessage('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h1>Join TFAS</h1>
        <p>Sign up to manage or participate in public fund allocation projects.</p>
      </div>
      <div className="signup-right">
        <h2>Signup</h2>
        <form className="signup-form" onSubmit={handleSignup}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="official">Government Official</option>
            <option value="auditor">Auditor</option>
            <option value="contractor">Contractor</option>
          </select>
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <button type="submit" className="continue-button" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;
