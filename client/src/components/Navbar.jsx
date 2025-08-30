import { NavLink, useNavigate } from 'react-router-dom';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const isAuth = !!(localStorage.getItem('accessToken') || localStorage.getItem('currentUser'));

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container">
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <span className="fs-3 me-2">🌱</span>
          <span className="fw-bold fs-4">CarbonTracker</span>
        </NavLink>

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

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}>
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/activities" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}>
                <i className="bi bi-activity me-1"></i>
                Activities
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/calculator" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}>
                <i className="bi bi-calculator me-1"></i>
                Calculator
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}>
                <i className="bi bi-clock-history me-1"></i>
                History
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/goals" className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}>
                <i className="bi bi-target me-1"></i>
                Goals
              </NavLink>
            </li>
          </ul>

          <div className="d-flex gap-2">
            <button className="btn btn-light btn-sm fw-semibold">
              <i className="bi bi-plus-circle me-1"></i>
              Add Activity
            </button>

            {isAuth ? (
              <>
                <button className="btn btn-outline-light btn-sm me-2" onClick={() => navigate('/profile')}>
                  <i className="bi bi-person-circle me-1"></i>
                  Profile
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-outline-light btn-sm me-2" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="btn btn-light btn-sm" onClick={() => navigate('/signup')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;