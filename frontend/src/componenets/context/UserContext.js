import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate()
  let user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [details, setDetails] = useState(user);

   console.log({details})
  const login = async (data) => {
 
      Cookies.set("user", JSON.stringify(data)); // Store only the data part
      Cookies.set("isAuthenticated", true)
      setDetails(data);
   
  };

  const logout =async () => {
    Object.keys(Cookies.get()).forEach(cookie => {
      Cookies.remove(cookie);
    });
    setDetails(null);
    // navigate("/login")
  };

  return (
    <AuthContext.Provider value={{ details, login, logout }}>
      {children} {/* Ensure 'children' is used instead of 'Children' */}
    </AuthContext.Provider>
  );
};
