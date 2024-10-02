import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Login from "./componenets/Login/Login";
import { AuthContext } from "./componenets/context/UserContext";
import {
  NotLoggedInRoutes,
  PrivateRoutes,
} from "./componenets/Protected/Protected";
import Employees from "./componenets/Employee/Employees";
import Navbar from "./componenets/Navbar/Navbar";
import Empform from "./componenets/Employee/Empform";
import axios from "axios";

function App() {
  const { details } = useContext(AuthContext);
  console.log(details);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await axios.get("http://localhost:8000/emp/allEmp", {
          headers: {
            Authorization: `Bearer ${details.token}`,
          },
        });
        setData(result.data);
      } catch (err) {
        setError("Failed to fetch employees.");
      }
    };

    fetchEmployees();
  }, [details?.token, data]);

  return (
    <>
      <Navbar details={details} />
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route
            path="/employee"
            element={
              <Employees details={details} data={data} setData={setData} />
            }
          />
          <Route path="/empform" element={<Empform details={details} />} />
          <Route path="/editform/:id" element={<Empform details={details} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
