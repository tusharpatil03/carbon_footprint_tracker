import "./App.css";
import Navbar from "./components/Navbar";
import CarbonCalculator from "./components/CarbonCalculator";
import History from "./components/History";
import Dashboard from "./components/Dashboard";
import Activities from "./components/Activities";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onLoginSuccess={() => navigate("/")}
              onSwitchToSignup={() => navigate("/signup")}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              onSignupSuccess={() => navigate("/")}
              onSwitchToLogin={() => navigate("/login")}
            />
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calculator"
          element={
            <ProtectedRoute>
              <CarbonCalculator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback to dashboard for unknown routes when authenticated */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
