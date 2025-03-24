import React, { useState } from 'react';
import Web3 from 'web3';
import './Signup.css'; // Reuse the same styles as Signup

const Signin = ({ contractInstance, account }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || 'Signin failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during signin:', err);
      setMessage('Signin failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h1>Welcome Back</h1>
        <p>Sign in to manage or participate in public fund allocation projects.</p>
      </div>
      <div className="signup-right">
        <h2>Signin</h2>
        <form className="signup-form" onSubmit={handleSignin}>
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="continue-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Signin;
