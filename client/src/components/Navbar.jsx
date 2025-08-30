import { useState } from 'react';

function Navbar({ onPageChange, currentPage }) {
  const handleNavClick = (page) => {
    onPageChange(page);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container">
        {/* Brand */}
        <a 
          className="navbar-brand d-flex align-items-center" 
          href="#dashboard"
          onClick={() => handleNavClick('dashboard')}
        >
          <span className="fs-3 me-2">🌱</span>
          <span className="fw-bold fs-4">CarbonTracker</span>
        </a>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'dashboard' ? 'active fw-semibold' : ''}`} 
                href="#dashboard"
                onClick={() => handleNavClick('dashboard')}
              >
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'activities' ? 'active fw-semibold' : ''}`} 
                href="#activities"
                onClick={() => handleNavClick('activities')}
              >
                <i className="bi bi-activity me-1"></i>
                Activities
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'calculator' ? 'active fw-semibold' : ''}`} 
                href="#calculator"
                onClick={() => handleNavClick('calculator')}
              >
                <i className="bi bi-calculator me-1"></i>
                Calculator
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'history' ? 'active fw-semibold' : ''}`} 
                href="#history"
                onClick={() => handleNavClick('history')}
              >
                <i className="bi bi-clock-history me-1"></i>
                History
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'goals' ? 'active fw-semibold' : ''}`} 
                href="#goals"
                onClick={() => handleNavClick('goals')}
              >
                <i className="bi bi-target me-1"></i>
                Goals
              </a>
            </li>
          </ul>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <button className="btn btn-light btn-sm fw-semibold">
              <i className="bi bi-plus-circle me-1"></i>
              Add Activity
            </button>
            <button className="btn btn-outline-light btn-sm">
              <i className="bi bi-person-circle me-1"></i>
              Profile
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;