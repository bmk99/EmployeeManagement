import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import LoginForm from "../Login/Login";
import React from "react";

export const PrivateRoutes = () => {
  const { details } = useContext(AuthContext);
  console.log({ details });
  return details ? <Outlet /> : <Navigate to="/login" />;
};

export const NotLoggedInRoutes = () => {
  const { details } = useContext(AuthContext);
  return details ? <LoginForm /> : <Outlet />;
};
