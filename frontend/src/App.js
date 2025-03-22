import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import GovernmentOfficialDashboard from './pages/GovernmentOfficialDashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import CitizensPage from './pages/CitizensPage';
import NotFound from './pages/NotFound';
import logo from './assets/TFAS-logo.webp';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <img src={logo} alt="TFAS Logo" className="logo" />
          <h1>Transparent Fund Allocation System (TFAS)</h1>
          <nav className="nav">
            <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}>
              Home
            </NavLink>
            <NavLink to="/about" style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}>
              About
            </NavLink>
            <NavLink to="/contact" style={({ isActive }) => ({ color: isActive ? '#007BFF' : '#333' })}>
              Contact
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/government-official-dashboard" element={<GovernmentOfficialDashboard />} />
          <Route path="/auditor-dashboard" element={<AuditorDashboard />} />
          <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
          <Route path="/citizens" element={<CitizensPage />} />
          <Route path="*" element={<NotFound />} />
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
  );
}

export default App;