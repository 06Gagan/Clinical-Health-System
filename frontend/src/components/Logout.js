import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout(); // Clear login status
    navigate("/login"); // Redirect to login page
  }, [onLogout, navigate]);

  return null;
};

export default Logout;
