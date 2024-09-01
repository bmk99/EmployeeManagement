import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext, useState } from "react";
import Login from "./componenets/Login/Login";
import { AuthContext } from "./componenets/context/UserContext";
import {
  NotLoggedInRoutes,
  PrivateRoutes,
} from "./componenets/Protected/Protected";
import Employees from "./componenets/Employee/Employees";
import Navbar from "./componenets/Navbar/Navbar";
import Empform from "./componenets/Employee/Empform";

function App() {
  const { details } = useContext(AuthContext);
  console.log(details);

  return (
    <>
      <Navbar details={details} />
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/employee" element={<Employees details={details} />} />
          <Route path="/empform" element={<Empform details={details} />} />
          <Route path="/editform/:id" element={<Empform details={details} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
