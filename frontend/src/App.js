import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import DemographicForm from "./components/DemographicForm";
import HealthDataForm from "./components/HealthDataForm";
import SchedulingPage from "./components/SchedulingPage";
import Dashboard from "./components/Dashboard";
import Logout from "./components/Logout";

function App() {
  const [mode, setMode] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      setMode("light");
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn && (
        <Navbar title="CTPM" mode={mode} toggleMode={toggleMode} role="PI" />
      )}
      <Routes>
        <Route exact path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route exact path="/" element={isLoggedIn ? <Navigate to="/PI" /> : <Navigate to="/login" />} />
        <Route exact path="/CRC" element={isLoggedIn ? <DemographicForm /> : <Navigate to="/login" />} />
        <Route exact path="/Scheduling" element={isLoggedIn ? <SchedulingPage /> : <Navigate to="/login" />} />
        <Route exact path="/HealthData" element={isLoggedIn ? <HealthDataForm /> : <Navigate to="/login" />} />
        <Route exact path="/PI" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route exact path="/Logout" element={<Logout onLogout={handleLogout} />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
