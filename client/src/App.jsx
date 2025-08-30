import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import CarbonCalculator from './components/CarbonCalculator'
import History from './components/History'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentPage('login');
    setShowSignup(false);
  };

  const renderAuthPages = () => {
    if (showSignup) {
      return (
        <Signup 
          onSwitchToLogin={() => setShowSignup(false)}
          onSignupSuccess={handleSignupSuccess}
        />
      );
    }
    return (
      <Login 
        onSwitchToSignup={() => setShowSignup(true)}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'calculator':
        return <CarbonCalculator />;
      case 'history':
        return <History />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <Navbar 
            onPageChange={setCurrentPage} 
            currentPage={currentPage}
            onLogout={handleLogout}
          />
          {renderPage()}
        </>
      ) : (
        renderAuthPages()
      )}
    </>
  );
}

export default App
