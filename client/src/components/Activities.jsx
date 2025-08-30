import { useState, useEffect } from 'react';
import './Activities.css';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    category: 'transport',
    carbonImpact: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Load activities from localStorage on component mount
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    const data = JSON.parse(localStorage.getItem('userActivities') || '[]');
    setActivities(data);
  };

  const saveActivities = (data) => {
    localStorage.setItem('userActivities', JSON.stringify(data));
    setActivities(data);
  };

  const addActivity = () => {
    if (!newActivity.name || !newActivity.carbonImpact) {
      alert('Please fill in all required fields');
      return;
    }

    const activity = {
      id: Date.now(),
      ...newActivity,
      carbonImpact: parseFloat(newActivity.carbonImpact),
      createdAt: new Date().toISOString()
    };

    const updatedActivities = [activity, ...activities];
    saveActivities(updatedActivities);

    // Reset form
    setNewActivity({
      name: '',
      category: 'transport',
      carbonImpact: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddForm(false);
  };

  const deleteActivity = (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const updatedActivities = activities.filter(activity => activity.id !== id);
      saveActivities(updatedActivities);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      transport: 'bi-car-front',
      energy: 'bi-lightning',
      lifestyle: 'bi-heart',
      food: 'bi-cup-hot',
      waste: 'bi-recycle'
    };
    return icons[category] || 'bi-activity';
  };

  const getCategoryColor = (category) => {
    const colors = {
      transport: 'primary',
      energy: 'warning',
      lifestyle: 'info',
      food: 'success',
      waste: 'secondary'
    };
    return colors[category] || 'dark';
  };

  const getTotalCarbonImpact = () => {
    return activities.reduce((total, activity) => total + activity.carbonImpact, 0);
  };

  const getCategoryBreakdown = () => {
    const breakdown = {};
    activities.forEach(activity => {
      if (!breakdown[activity.category]) {
        breakdown[activity.category] = 0;
      }
      breakdown[activity.category] += activity.carbonImpact;
    });
    return breakdown;
  };

  const filterAndSortActivities = () => {
    let filtered = activities;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === filterCategory);
    }

    switch (sortBy) {
      case 'date':
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'carbonImpact':
        return filtered.sort((a, b) => b.carbonImpact - a.carbonImpact);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredActivities = filterAndSortActivities();
  const totalImpact = getTotalCarbonImpact();
  const categoryBreakdown = getCategoryBreakdown();

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                <i className="bi bi-activity me-2"></i>
                Daily Activities Tracker
              </h3>
              <button
                className="btn btn-light"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <i className={`bi ${showAddForm ? 'bi-dash' : 'bi-plus'} me-2`}></i>
                {showAddForm ? 'Cancel' : 'Add Activity'}
              </button>
            </div>
            <div className="card-body">
              {/* Add Activity Form */}
              {showAddForm && (
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">Add New Activity</h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Activity Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newActivity.name}
                          onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                          placeholder="e.g., Drove to work"
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          value={newActivity.category}
                          onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                        >
                          <option value="transport">Transport</option>
                          <option value="energy">Energy</option>
                          <option value="lifestyle">Lifestyle</option>
                          <option value="food">Food</option>
                          <option value="waste">Waste</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Carbon Impact (kg CO₂)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={newActivity.carbonImpact}
                          onChange={(e) => setNewActivity({...newActivity, carbonImpact: e.target.value})}
                          placeholder="e.g., 2.5"
                          step="0.1"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={newActivity.date}
                          onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Notes (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newActivity.notes}
                          onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                          placeholder="Additional details..."
                        />
                      </div>
                      <div className="col-12">
                        <button
                          className="btn btn-success"
                          onClick={addActivity}
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Add Activity
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white text-center">
                    <div className="card-body">
                      <h5 className="card-title">Total Activities</h5>
                      <h3>{activities.length}</h3>
                      <small>Tracked so far</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success text-white text-center">
                    <div className="card-title">Total Impact</div>
                    <h3>{totalImpact.toFixed(1)} kg CO₂</h3>
                    <small>Carbon footprint</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white text-center">
                    <div className="card-title">This Month</div>
                    <h3>{(totalImpact / 12).toFixed(1)} kg CO₂</h3>
                    <small>Monthly average</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning text-white text-center">
                    <div className="card-title">Categories</div>
                    <h3>{Object.keys(categoryBreakdown).length}</h3>
                    <small>Different types</small>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Category Breakdown</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Object.entries(categoryBreakdown).map(([category, impact]) => (
                          <div key={category} className="col-md-4 mb-3">
                            <div className="d-flex align-items-center">
                              <div className={`bg-${getCategoryColor(category)} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} style={{width: '40px', height: '40px'}}>
                                <i className={`bi ${getCategoryIcon(category)}`}></i>
                              </div>
                              <div>
                                <h6 className="mb-0 text-capitalize">{category}</h6>
                                <small className="text-muted">{impact.toFixed(1)} kg CO₂</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Controls */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Filter by Category</label>
                  <select
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="transport">Transport</option>
                    <option value="energy">Energy</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="food">Food</option>
                    <option value="waste">Waste</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Sort By</label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Date (Newest)</option>
                    <option value="carbonImpact">Carbon Impact (High to Low)</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all activities?')) {
                        saveActivities([]);
                      }
                    }}
                    disabled={activities.length === 0}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Clear All
                  </button>
                </div>
              </div>

              {/* Activities List */}
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Activity</th>
                      <th>Category</th>
                      <th>Carbon Impact</th>
                      <th>Date</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((activity) => (
                      <tr key={activity.id}>
                        <td>
                          <strong>{activity.name}</strong>
                        </td>
                        <td>
                          <span className={`badge bg-${getCategoryColor(activity.category)}`}>
                            <i className={`bi ${getCategoryIcon(activity.category)} me-1`}></i>
                            {activity.category}
                          </span>
                        </td>
                        <td>
                          <span className="text-danger fw-bold">
                            {activity.carbonImpact.toFixed(1)} kg CO₂
                          </span>
                        </td>
                        <td>{formatDate(activity.date)}</td>
                        <td>
                          <small className="text-muted">{activity.notes || '-'}</small>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteActivity(activity.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredActivities.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-activity fs-1 text-muted mb-3"></i>
                  <h4>No Activities Found</h4>
                  <p className="text-muted">
                    {activities.length === 0 
                      ? "Start tracking your daily activities to see their carbon impact here."
                      : "No activities match the selected filters."
                    }
                  </p>
                  {activities.length === 0 && (
                    <button 
                      className="btn btn-success"
                      onClick={() => setShowAddForm(true)}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Your First Activity
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

export default Activities;
