import { useState } from 'react';
import './CarbonCalculator.css';

function CarbonCalculator() {
  const [activeTab, setActiveTab] = useState('transport');
  const [results, setResults] = useState({});
  const [formData, setFormData] = useState({
    transport: {
      carDistance: '',
      carType: 'gasoline',
      publicTransport: '',
      flights: ''
    },
    energy: {
      electricity: '',
      naturalGas: '',
      heatingOil: ''
    },
    lifestyle: {
      meatConsumption: 'medium',
      waste: 'medium',
      shopping: 'medium'
    }
  });

  // Carbon emission factors (kg CO2 per unit)
  const emissionFactors = {
    transport: {
      gasoline: 2.31, // kg CO2 per liter
      diesel: 2.68,
      electric: 0.1, // depends on electricity source
      publicTransport: 0.14, // kg CO2 per km
      flight: 0.255 // kg CO2 per km
    },
    energy: {
      electricity: 0.5, // kg CO2 per kWh (varies by region)
      naturalGas: 2.02, // kg CO2 per m3
      heatingOil: 2.68 // kg CO2 per liter
    }
  };

  const calculateTransport = () => {
    const { carDistance, carType, publicTransport, flights } = formData.transport;
    let total = 0;

    if (carDistance && carType) {
      total += parseFloat(carDistance) * emissionFactors.transport[carType];
    }
    if (publicTransport) {
      total += parseFloat(publicTransport) * emissionFactors.transport.publicTransport;
    }
    if (flights) {
      total += parseFloat(flights) * emissionFactors.transport.flight;
    }

    return total;
  };

  const calculateEnergy = () => {
    const { electricity, naturalGas, heatingOil } = formData.energy;
    let total = 0;

    if (electricity) {
      total += parseFloat(electricity) * emissionFactors.energy.electricity;
    }
    if (naturalGas) {
      total += parseFloat(naturalGas) * emissionFactors.energy.naturalGas;
    }
    if (heatingOil) {
      total += parseFloat(heatingOil) * emissionFactors.energy.heatingOil;
    }

    return total;
  };

  const calculateLifestyle = () => {
    const { meatConsumption, waste, shopping } = formData.lifestyle;
    let total = 0;

    // Lifestyle factors (kg CO2 per year)
    const lifestyleFactors = {
      meatConsumption: { low: 500, medium: 1000, high: 2000 },
      waste: { low: 200, medium: 400, high: 600 },
      shopping: { low: 300, medium: 600, high: 1000 }
    };

    total += lifestyleFactors.meatConsumption[meatConsumption];
    total += lifestyleFactors.waste[waste];
    total += lifestyleFactors.shopping[shopping];

    return total;
  };

  const saveToLocalStorage = (calculationData) => {
    const existingData = JSON.parse(localStorage.getItem('carbonFootprintHistory') || '[]');
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...calculationData,
      notes: `Calculation on ${new Date().toLocaleDateString()}`
    };
    
    existingData.unshift(newEntry); // Add to beginning of array
    localStorage.setItem('carbonFootprintHistory', JSON.stringify(existingData));
  };

  const handleCalculate = () => {
    const transportEmissions = calculateTransport();
    const energyEmissions = calculateEnergy();
    const lifestyleEmissions = calculateLifestyle();
    const totalEmissions = transportEmissions + energyEmissions + lifestyleEmissions;

    const calculationResults = {
      transport: transportEmissions,
      energy: energyEmissions,
      lifestyle: lifestyleEmissions,
      total: totalEmissions
    };

    setResults(calculationResults);
    saveToLocalStorage(calculationResults);
  };

  const handleInputChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const getEmissionsLevel = (total) => {
    if (total < 2000) return { level: 'Low', color: 'success' };
    if (total < 5000) return { level: 'Medium', color: 'warning' };
    return { level: 'High', color: 'danger' };
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">
                <i className="bi bi-calculator me-2"></i>
                Carbon Footprint Calculator
              </h3>
            </div>
            <div className="card-body">
              {/* Navigation Tabs */}
              <ul className="nav nav-tabs mb-4" id="calculatorTabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'transport' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transport')}
                  >
                    <i className="bi bi-car-front me-1"></i>
                    Transport
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'energy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('energy')}
                  >
                    <i className="bi bi-lightning me-1"></i>
                    Energy
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'lifestyle' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lifestyle')}
                  >
                    <i className="bi bi-heart me-1"></i>
                    Lifestyle
                  </button>
                </li>
              </ul>

              {/* Transport Tab */}
              {activeTab === 'transport' && (
                <div className="tab-content">
                  <h5 className="mb-3">Transportation Emissions</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Car Distance (km/year)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.transport.carDistance}
                        onChange={(e) => handleInputChange('transport', 'carDistance', e.target.value)}
                        placeholder="e.g., 12000"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Car Type</label>
                      <select
                        className="form-select"
                        value={formData.transport.carType}
                        onChange={(e) => handleInputChange('transport', 'carType', e.target.value)}
                      >
                        <option value="gasoline">Gasoline</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Public Transport (km/year)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.transport.publicTransport}
                        onChange={(e) => handleInputChange('transport', 'publicTransport', e.target.value)}
                        placeholder="e.g., 2000"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Flight Distance (km/year)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.transport.flights}
                        onChange={(e) => handleInputChange('transport', 'flights', e.target.value)}
                        placeholder="e.g., 5000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Energy Tab */}
              {activeTab === 'energy' && (
                <div className="tab-content">
                  <h5 className="mb-3">Energy Consumption</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Electricity (kWh/year)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.energy.electricity}
                        onChange={(e) => handleInputChange('energy', 'electricity', e.target.value)}
                        placeholder="e.g., 3000"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Natural Gas (m³/year)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.energy.naturalGas}
                        onChange={(e) => handleInputChange('energy', 'naturalGas', e.target.value)}
                        placeholder="e.g., 1500"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Heating Oil (liters/year)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.energy.heatingOil}
                        onChange={(e) => handleInputChange('energy', 'heatingOil', e.target.value)}
                        placeholder="e.g., 800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Lifestyle Tab */}
              {activeTab === 'lifestyle' && (
                <div className="tab-content">
                  <h5 className="mb-3">Lifestyle Choices</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Meat Consumption</label>
                      <select
                        className="form-select"
                        value={formData.lifestyle.meatConsumption}
                        onChange={(e) => handleInputChange('lifestyle', 'meatConsumption', e.target.value)}
                      >
                        <option value="low">Low (Vegetarian/Vegan)</option>
                        <option value="medium">Medium (Occasional meat)</option>
                        <option value="high">High (Daily meat)</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Waste Management</label>
                      <select
                        className="form-select"
                        value={formData.lifestyle.waste}
                        onChange={(e) => handleInputChange('lifestyle', 'waste', e.target.value)}
                      >
                        <option value="low">Low (Minimal waste)</option>
                        <option value="medium">Medium (Some recycling)</option>
                        <option value="high">High (Mostly landfill)</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Shopping Habits</label>
                      <select
                        className="form-select"
                        value={formData.lifestyle.shopping}
                        onChange={(e) => handleInputChange('lifestyle', 'shopping', e.target.value)}
                      >
                        <option value="low">Low (Sustainable products)</option>
                        <option value="medium">Medium (Mixed)</option>
                        <option value="high">High (Fast fashion/imports)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculate Button */}
              <div className="text-center mt-4">
                <button 
                  className="btn btn-success btn-lg px-5"
                  onClick={handleCalculate}
                >
                  <i className="bi bi-calculator me-2"></i>
                  Calculate Carbon Footprint
                </button>
              </div>

              {/* Results */}
              {results.total && (
                <div className="mt-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h5 className="card-title text-center mb-3">
                        <i className="bi bi-graph-up me-2"></i>
                        Your Carbon Footprint Results
                      </h5>
                      
                      <div className="row text-center">
                        <div className="col-md-3">
                          <div className="border-end">
                            <h6 className="text-muted">Transport</h6>
                            <h4 className="text-primary">{results.transport.toFixed(1)} kg CO₂</h4>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border-end">
                            <h6 className="text-muted">Energy</h6>
                            <h4 className="text-warning">{results.energy.toFixed(1)} kg CO₂</h4>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="border-end">
                            <h6 className="text-muted">Lifestyle</h6>
                            <h4 className="text-info">{results.lifestyle.toFixed(1)} kg CO₂</h4>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <h6 className="text-muted">Total</h6>
                          <h3 className={`text-${getEmissionsLevel(results.total).color}`}>
                            {results.total.toFixed(1)} kg CO₂
                          </h3>
                        </div>
                      </div>

                      <div className="text-center mt-3">
                        <span className={`badge bg-${getEmissionsLevel(results.total).color} fs-6`}>
                          {getEmissionsLevel(results.total).level} Impact Level
                        </span>
                      </div>

                      <div className="mt-3 p-3 bg-white rounded">
                        <h6>Tips to Reduce Your Footprint:</h6>
                        <ul className="list-unstyled">
                          <li><i className="bi bi-check-circle text-success me-2"></i>Use public transport or carpool</li>
                          <li><i className="bi bi-check-circle text-success me-2"></i>Switch to renewable energy sources</li>
                          <li><i className="bi bi-check-circle text-success me-2"></i>Reduce meat consumption</li>
                          <li><i className="bi bi-check-circle text-success me-2"></i>Recycle and compost waste</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarbonCalculator;