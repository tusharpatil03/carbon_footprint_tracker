import { useState, useEffect } from 'react';
import './History.css';

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editNotes, setEditNotes] = useState('');

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filterDataByPeriod = () => {
    if (selectedPeriod === 'all') return historyData;
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (selectedPeriod) {
      case '3months':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return historyData;
    }
    
    return historyData.filter(entry => new Date(entry.date) >= filterDate);
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditNotes(entry.notes || '');
  };

  const handleSaveEdit = () => {
    if (!editingEntry) return;
    
    const updatedData = historyData.map(entry => 
      entry.id === editingEntry.id 
        ? { ...entry, notes: editNotes }
        : entry
    );
    
    localStorage.setItem('carbonFootprintHistory', JSON.stringify(updatedData));
    setHistoryData(updatedData);
    setEditingEntry(null);
    setEditNotes('');
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditNotes('');
  };

  const handleDelete = (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updatedData = historyData.filter(entry => entry.id !== entryId);
      localStorage.setItem('carbonFootprintHistory', JSON.stringify(updatedData));
      setHistoryData(updatedData);
      if (selectedEntry && selectedEntry.id === entryId) {
        setSelectedEntry(null);
      }
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(historyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carbon-footprint-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredData = filterDataByPeriod();

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
                      <h3>{historyData.length > 0 ? historyData[0].total.toFixed(1) : 0} kg CO₂</h3>
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
                      <h3>{historyData.length > 0 ? Math.min(...historyData.map(h => h.total)).toFixed(1) : 0} kg CO₂</h3>
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
                  <button 
                    className="btn btn-outline-success"
                    onClick={handleExport}
                    disabled={historyData.length === 0}
                  >
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
                    {filteredData.map((entry) => (
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
                          <span className="text-primary">{entry.transport.toFixed(1)} kg CO₂</span>
                        </td>
                        <td>
                          <span className="text-warning">{entry.energy.toFixed(1)} kg CO₂</span>
                        </td>
                        <td>
                          <span className="text-info">{entry.lifestyle.toFixed(1)} kg CO₂</span>
                        </td>
                        <td>
                          <strong className={`text-${getEmissionsLevel(entry.total).color}`}>
                            {entry.total.toFixed(1)} kg CO₂
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
                            <button 
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEntry(entry);
                              }}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-outline-warning"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(entry);
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(entry.id);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit Modal */}
              {editingEntry && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Notes</h5>
                        <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
                      </div>
                      <div className="modal-body">
                        <label className="form-label">Notes</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes about this calculation..."
                        ></textarea>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal-backdrop fade show"></div>
                </div>
              )}

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
                              Transport: {selectedEntry.transport.toFixed(1)} kg CO₂
                            </div>
                          </div>
                          <div className="progress mb-3" style={{ height: '25px' }}>
                            <div 
                              className="progress-bar bg-warning" 
                              style={{ width: `${(selectedEntry.energy / selectedEntry.total) * 100}%` }}
                            >
                              Energy: {selectedEntry.energy.toFixed(1)} kg CO₂
                            </div>
                          </div>
                          <div className="progress mb-3" style={{ height: '25px' }}>
                            <div 
                              className="progress-bar bg-info" 
                              style={{ width: `${(selectedEntry.lifestyle / selectedEntry.total) * 100}%` }}
                            >
                              Lifestyle: {selectedEntry.lifestyle.toFixed(1)} kg CO₂
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
              {filteredData.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-clock-history fs-1 text-muted mb-3"></i>
                  <h4>No History Available</h4>
                  <p className="text-muted">
                    {historyData.length === 0 
                      ? "Start tracking your carbon footprint to see your history here."
                      : "No data found for the selected time period."
                    }
                  </p>
                  {historyData.length === 0 && (
                    <button className="btn btn-success">
                      <i className="bi bi-calculator me-2"></i>
                      Calculate Your Footprint
                    </button>
                  )}
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
