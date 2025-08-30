import { useState } from 'react';
import './History.css';

function History() {
  // Mock data for demonstration - in a real app, this would come from a database
  const [historyData] = useState([
    {
      id: 1,
      date: '2024-01-15',
      transport: 850,
      energy: 420,
      lifestyle: 600,
      total: 1870,
      notes: 'Started tracking carbon footprint'
    },
    {
      id: 2,
      date: '2024-02-15',
      transport: 780,
      energy: 380,
      lifestyle: 550,
      total: 1710,
      notes: 'Reduced car usage, switched to public transport'
    },
    {
      id: 3,
      date: '2024-03-15',
      transport: 720,
      energy: 350,
      lifestyle: 500,
      total: 1570,
      notes: 'Installed LED lights, reduced meat consumption'
    },
    {
      id: 4,
      date: '2024-04-15',
      transport: 680,
      energy: 320,
      lifestyle: 480,
      total: 1480,
      notes: 'Started composting, bought local produce'
    },
    {
      id: 5,
      date: '2024-05-15',
      transport: 650,
      energy: 300,
      lifestyle: 450,
      total: 1400,
      notes: 'Switched to renewable energy provider'
    }
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const getEmissionsLevel = (total) => {
    if (total < 2000) return { level: 'Low', color: 'success' };
    if (total < 5000) return { level: 'Medium', color: 'warning' };
    return { level: 'High', color: 'danger' };
  };

  const calculateProgress = () => {
    if (historyData.length < 2) return 0;
    const first = historyData[0].total;
    const latest = historyData[historyData.length - 1].total;
    return ((first - latest) / first * 100).toFixed(1);
  };

  const getAverageEmissions = () => {
    const total = historyData.reduce((sum, entry) => sum + entry.total, 0);
    return (total / historyData.length).toFixed(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Carbon Footprint History
              </h3>
            </div>
            <div className="card-body">
              {/* Summary Cards */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h5 className="card-title">Current Footprint</h5>
                      <h3>{historyData[historyData.length - 1]?.total || 0} kg CO₂</h3>
                      <small>Latest measurement</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h5 className="card-title">Progress</h5>
                      <h3>{calculateProgress()}%</h3>
                      <small>Reduction achieved</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <h5 className="card-title">Average</h5>
                      <h3>{getAverageEmissions()} kg CO₂</h3>
                      <small>Monthly average</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <h5 className="card-title">Best Month</h5>
                      <h3>{Math.min(...historyData.map(h => h.total))} kg CO₂</h3>
                      <small>Lowest footprint</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Time Period</label>
                  <select 
                    className="form-select"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="3months">Last 3 Months</option>
                    <option value="6months">Last 6 Months</option>
                    <option value="1year">Last Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <button className="btn btn-outline-success">
                    <i className="bi bi-download me-2"></i>
                    Export Data
                  </button>
                </div>
              </div>

              {/* History Table */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Date</th>
                      <th>Transport</th>
                      <th>Energy</th>
                      <th>Lifestyle</th>
                      <th>Total</th>
                      <th>Impact Level</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((entry) => (
                      <tr 
                        key={entry.id}
                        className={selectedEntry?.id === entry.id ? 'table-active' : ''}
                        onClick={() => setSelectedEntry(entry)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <strong>{formatDate(entry.date)}</strong>
                        </td>
                        <td>
                          <span className="text-primary">{entry.transport} kg CO₂</span>
                        </td>
                        <td>
                          <span className="text-warning">{entry.energy} kg CO₂</span>
                        </td>
                        <td>
                          <span className="text-info">{entry.lifestyle} kg CO₂</span>
                        </td>
                        <td>
                          <strong className={`text-${getEmissionsLevel(entry.total).color}`}>
                            {entry.total} kg CO₂
                          </strong>
                        </td>
                        <td>
                          <span className={`badge bg-${getEmissionsLevel(entry.total).color}`}>
                            {getEmissionsLevel(entry.total).level}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">{entry.notes}</small>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-outline-warning">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detailed View */}
              {selectedEntry && (
                <div className="mt-4">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        Detailed View - {formatDate(selectedEntry.date)}
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Emissions Breakdown</h6>
                          <div className="progress mb-3" style={{ height: '25px' }}>
                            <div 
                              className="progress-bar bg-primary" 
                              style={{ width: `${(selectedEntry.transport / selectedEntry.total) * 100}%` }}
                            >
                              Transport: {selectedEntry.transport} kg CO₂
                            </div>
                          </div>
                          <div className="progress mb-3" style={{ height: '25px' }}>
                            <div 
                              className="progress-bar bg-warning" 
                              style={{ width: `${(selectedEntry.energy / selectedEntry.total) * 100}%` }}
                            >
                              Energy: {selectedEntry.energy} kg CO₂
                            </div>
                          </div>
                          <div className="progress mb-3" style={{ height: '25px' }}>
                            <div 
                              className="progress-bar bg-info" 
                              style={{ width: `${(selectedEntry.lifestyle / selectedEntry.total) * 100}%` }}
                            >
                              Lifestyle: {selectedEntry.lifestyle} kg CO₂
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h6>Notes & Observations</h6>
                          <p className="text-muted">{selectedEntry.notes}</p>
                          <div className="mt-3">
                            <span className={`badge bg-${getEmissionsLevel(selectedEntry.total).color} fs-6`}>
                              {getEmissionsLevel(selectedEntry.total).level} Impact Level
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {historyData.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-clock-history fs-1 text-muted mb-3"></i>
                  <h4>No History Available</h4>
                  <p className="text-muted">Start tracking your carbon footprint to see your history here.</p>
                  <button className="btn btn-success">
                    <i className="bi bi-calculator me-2"></i>
                    Calculate Your Footprint
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
