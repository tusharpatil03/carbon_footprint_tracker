import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ onNavigate }) {
  const [historyData, setHistoryData] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = () => {
    const data = JSON.parse(localStorage.getItem('carbonFootprintHistory') || '[]');
    setHistoryData(data);
  };

  const getEmissionsLevel = (total) => {
    if (total < 2000) return { level: 'Low', color: 'success' };
    if (total < 5000) return { level: 'Medium', color: 'warning' };
    return { level: 'High', color: 'danger' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    if (historyData.length < 2) return 0;
    const first = historyData[0].total;
    const latest = historyData[historyData.length - 1].total;
    return ((first - latest) / first * 100).toFixed(1);
  };

  const getAverageEmissions = () => {
    if (historyData.length === 0) return 0;
    const total = historyData.reduce((sum, entry) => sum + entry.total, 0);
    return (total / historyData.length).toFixed(1);
  };

  const getBestMonth = () => {
    if (historyData.length === 0) return 0;
    return Math.min(...historyData.map(h => h.total)).toFixed(1);
  };

  const getRecentCalculations = () => {
    return historyData.slice(0, 3); // Get last 3 calculations
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          {/* Welcome Section */}
          <div className="card shadow mb-4">
            <div className="card-body text-center">
              <h2 className="text-success mb-3">
                <i className="bi bi-speedometer2 me-2"></i>
                Welcome to CarbonTracker
              </h2>
              <p className="lead">
                Track your carbon footprint and make sustainable choices for a better future.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={() => onNavigate('calculator')}
                >
                  <i className="bi bi-calculator me-2"></i>
                  Calculate Footprint
                </button>
                <button 
                  className="btn btn-outline-success btn-lg"
                  onClick={() => onNavigate('history')}
                >
                  <i className="bi bi-clock-history me-2"></i>
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white text-center">
                <div className="card-body">
                  <i className="bi bi-graph-down fs-1 mb-2"></i>
                  <h4>{calculateProgress()}%</h4>
                  <p className="mb-0">Reduction Achieved</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white text-center">
                <div className="card-body">
                  <i className="bi bi-calendar-check fs-1 mb-2"></i>
                  <h4>{historyData.length}</h4>
                  <p className="mb-0">Calculations Done</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white text-center">
                <div className="card-body">
                  <i className="bi bi-target fs-1 mb-2"></i>
                  <h4>{getAverageEmissions()}</h4>
                  <p className="mb-0">Average (kg CO₂)</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white text-center">
                <div className="card-body">
                  <i className="bi bi-trophy fs-1 mb-2"></i>
                  <h4>{getBestMonth()}</h4>
                  <p className="mb-0">Best Month (kg CO₂)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Calculations */}
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-clock me-2"></i>
                    Recent Calculations
                  </h5>
                </div>
                <div className="card-body">
                  {getRecentCalculations().length > 0 ? (
                    getRecentCalculations().map((calc) => (
                      <div key={calc.id} className="calculation-item mb-3 p-3 border rounded">
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <strong>{formatDate(calc.date)}</strong>
                          </div>
                          <div className="col-md-3">
                            <span className="text-muted">Total:</span>
                            <strong className={`text-${getEmissionsLevel(calc.total).color}`}>
                              {calc.total.toFixed(1)} kg CO₂
                            </strong>
                          </div>
                          <div className="col-md-3">
                            <span className={`badge bg-${getEmissionsLevel(calc.total).color}`}>
                              {getEmissionsLevel(calc.total).level} Impact
                            </span>
                          </div>
                          <div className="col-md-3 text-end">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => onNavigate('history')}
                            >
                              <i className="bi bi-eye me-1"></i>
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-calculator fs-1 text-muted mb-3"></i>
                      <h6>No calculations yet</h6>
                      <p className="text-muted">Start by calculating your carbon footprint</p>
                      <button 
                        className="btn btn-success"
                        onClick={() => onNavigate('calculator')}
                      >
                        <i className="bi bi-calculator me-2"></i>
                        Calculate Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-lightbulb me-2"></i>
                    Quick Tips
                  </h5>
                </div>
                <div className="card-body">
                  <div className="tip-item mb-3">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Use public transport</strong> - Reduces emissions by up to 50%
                  </div>
                  <div className="tip-item mb-3">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Switch to LED bulbs</strong> - Saves energy and money
                  </div>
                  <div className="tip-item mb-3">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Eat less meat</strong> - Plant-based diets are more sustainable
                  </div>
                  <div className="tip-item mb-3">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Recycle regularly</strong> - Reduces waste in landfills
                  </div>
                  <div className="tip-item">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Buy local produce</strong> - Reduces transportation emissions
                  </div>
                </div>
              </div>

              <div className="card shadow mt-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="bi bi-target me-2"></i>
                    Next Goal
                  </h5>
                </div>
                <div className="card-body text-center">
                  {historyData.length > 0 ? (
                    <>
                      <div className="progress mb-3" style={{ height: '20px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${Math.min(calculateProgress(), 100)}%` }}
                        ></div>
                      </div>
                      <h6>Reduce your carbon footprint</h6>
                      <p className="text-muted">
                        {calculateProgress() > 0 
                          ? `You've reduced by ${calculateProgress()}% so far!`
                          : "Start tracking to see your progress"
                        }
                      </p>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => onNavigate('calculator')}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Calculate Again
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="progress mb-3" style={{ height: '20px' }}>
                        <div className="progress-bar bg-success" style={{ width: '0%' }}></div>
                      </div>
                      <h6>Set your first goal</h6>
                      <p className="text-muted">Start by calculating your current footprint</p>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => onNavigate('calculator')}
                      >
                        <i className="bi bi-calculator me-1"></i>
                        Start Tracking
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
