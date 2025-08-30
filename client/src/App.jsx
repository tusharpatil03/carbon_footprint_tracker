import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import CarbonCalculator from './components/CarbonCalculator'
import History from './components/History'
import Dashboard from './components/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

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
      <Navbar onPageChange={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
    </>
  )
}

export default App
