import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Import all pages
import About from './About';
import Contact from './Contact';
import GovernmentOfficialDashboard from './GovernmentOfficialDashboard';
import AuditorDashboard from './AuditorDashboard';
import ContractorDashboard from './ContractorDashboard';
import CitizensPage from './CitizensPage';
import logo from './logo.svg'; // Replace with your logo path
import './App.css'; // Add global styles

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header Section */}
        <header className="header">
          <div className="container">
            <img src={logo} alt="TFAS Logo" className="logo" />
            <h1>Transparent Fund Allocation System (TFAS)</h1>
            <nav className="nav">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/government-official-dashboard">Government Officials</a>
              <a href="/auditor-dashboard">Auditors</a>
              <a href="/contractor-dashboard">Contractors</a>
              <a href="/citizens">Citizens</a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<Home />} />

            {/* General Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Stakeholder Dashboards */}
            <Route path="/government-official-dashboard" element={<GovernmentOfficialDashboard />} />
            <Route path="/auditor-dashboard" element={<AuditorDashboard />} />
            <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
            <Route path="/citizens" element={<CitizensPage />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <footer className="footer">
          <div className="container">
            <p>&copy; 2023 TFAS. All rights reserved.</p>
            <p>Contact us: email@example.com | Phone: +123-456-7890</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;