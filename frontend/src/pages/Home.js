import React from 'react';
import './Home.css'; // Import the new CSS file for styling

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>All things public fund management, right here.</h1>
          <p>Built for a transparent and efficient India.</p>
          <div className="cta-buttons">
            <button onClick={() => window.location.href = '/signup'}>Get Started</button>
            <button onClick={() => window.location.href = '/about'}>Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/hero-image.png" alt="Public Fund Management" />
        </div>
      </section>

      {/* Key Objectives Section */}
      <section id="key-objectives" className="section">
        <h2>Key Objectives</h2>
        <div className="objectives-grid">
          <div className="objective-item">
            <h3>Transparency</h3>
            <p>Provide a clear record of all fund allocations and expenditures.</p>
          </div>
          <div className="objective-item">
            <h3>Accountability</h3>
            <p>Hold stakeholders accountable for misuse or misallocation of funds.</p>
          </div>
          <div className="objective-item">
            <h3>Efficiency</h3>
            <p>Streamline the fund disbursement process and reduce administrative overhead.</p>
          </div>
          <div className="objective-item">
            <h3>Trust</h3>
            <p>Build public trust by making the system tamper-proof and accessible.</p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="section">
        <h2>How It Works</h2>
        <ol className="workflow-steps">
          <li>
            <h3>Government Approves Budget</h3>
            <p>Funds are allocated for a public development project.</p>
          </li>
          <li>
            <h3>Funds Tokenized on Blockchain</h3>
            <p>Funds are represented as digital tokens and tracked in real time.</p>
          </li>
          <li>
            <h3>Smart Contracts Automate Payments</h3>
            <p>Payments are released only after milestones are verified.</p>
          </li>
          <li>
            <h3>Real-Time Monitoring</h3>
            <p>Stakeholders can track fund usage and project progress.</p>
          </li>
          <li>
            <h3>Immutable Audit Trail</h3>
            <p>All transactions are recorded on the blockchain for accountability.</p>
          </li>
        </ol>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="section">
        <h2>Benefits of TFAS</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <h3>For Citizens</h3>
            <p>Access real-time updates on public projects and provide feedback.</p>
          </div>
          <div className="benefit-item">
            <h3>For Government Officials</h3>
            <p>Ensure funds are used efficiently and transparently.</p>
          </div>
          <div className="benefit-item">
            <h3>For Contractors</h3>
            <p>Receive timely payments upon milestone completion.</p>
          </div>
          <div className="benefit-item">
            <h3>For Auditors</h3>
            <p>Verify expenditures with ease using immutable records.</p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="section">
        <h2>Impact of TFAS</h2>
        <ul className="impact-list">
          <li>Reduce Corruption: Eliminate opportunities for fund diversion or misuse.</li>
          <li>Improve Accountability: Hold contractors and agencies accountable for their actions.</li>
          <li>Enhance Efficiency: Streamline fund disbursement and reduce administrative costs.</li>
          <li>Build Trust: Increase public confidence in government spending.</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;