import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Import the Home component
import About from './About';
import Contact from './Contact';
import Profile from './Profile';
import GovernmentOfficialDashboard from './GovernmentOfficialDashboard';
import AuditorDashboard from './AuditorDashboard';
import CitizenInfo from './CitizenInfo';
import CitizensPage from './CitizensPage'; // Import CitizensPage
import ContractorDashboard from './ContractorDashboard';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header Section */}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Welcome to the TFAS System</h1>
          <p>This platform allows you to track public development projects and manage expenditures efficiently.</p>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/government-official-dashboard">Government Officials</a>
            <a href="/auditor-dashboard">Auditors</a>
            <a href="/contractor-dashboard">Contractors</a>
            <a href="/citizens">Citizens</a>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} /> {/* Default route */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/government-official-dashboard" element={<GovernmentOfficialDashboard />} />
            <Route path="/auditor-dashboard" element={<AuditorDashboard />} />
            <Route path="/citizen-info" element={<CitizenInfo />} />
            <Route path="/citizens" element={<CitizensPage />} />
            <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <footer>
          <p>Contact us: email@example.com | Phone: 123-456-7890</p>
          <p>© 2023 TFAS. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
