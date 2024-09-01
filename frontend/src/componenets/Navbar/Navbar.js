import  { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../context/UserContext";

const Navbar = ({ details }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="header">
      <div className="container">
        <div className="left">
          <span>Deals Dray</span>
        </div>
        
        <div className="center">
            <NavLink to="/employee">HOME</NavLink>
        </div>
        
        <div className="right">
          <div className="username">{details?.username.toUpperCase()}</div>
          {details && (
            <button className="btn" onClick={handleLogout}>
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
