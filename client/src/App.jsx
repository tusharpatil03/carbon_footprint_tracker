import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import CarbonCalculator from './components/CarbonCalculator'
import History from './components/History'

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
        return (
          <div className="container mt-4">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="card shadow">
                  <div className="card-body text-center">
                    <h2 className="text-success mb-3">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Welcome to CarbonTracker
                    </h2>
                    <p className="lead">
                      Track your carbon footprint and make sustainable choices for a better future.
                    </p>
                    <button 
                      className="btn btn-success btn-lg"
                      onClick={() => setCurrentPage('calculator')}
                    >
                      <i className="bi bi-calculator me-2"></i>
                      Start Calculating
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
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
