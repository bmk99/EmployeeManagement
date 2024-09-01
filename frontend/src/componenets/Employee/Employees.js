import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Table } from "./Table";
import "./Employee.css";
import { useNavigate,Link } from "react-router-dom";

const Created = ({ value }) => {
  const date = new Date(value);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return <span>{formattedDate}</span>;
};

function Employees({ details }) {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: () => "Name",
        meta: {
          filterVariant: "name",
        },
      },
      {
        accessorKey: "image",
        cell: (info) => (
          <img
            src={`http://localhost:8000/uploads/${info.getValue()}`}
            alt="Profile"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        ),
        header: () => "Profile",
        enablingsorting: false,
        disablefilters: false,
      },
      {
        accessorKey: "email",
        cell: (info) => info.getValue(),
        header: () => "Email",
      },
      {
        accessorKey: "designation",
        cell: (info) => info.getValue(),
        header: () => "Designation",
        meta: {
          filterVariant: "designation",
        },
      },
      {
        accessorKey: "gender",
        // cell: info => info.getValue(),
        header: () => "Gender",
        meta: {
          filterVariant: "gender",
        },
      },
      {
        accessorKey: "course",
        header: () => <span>Course</span>,
        meta: {
          filterVariant: "course",
        },
      },
      {
        accessorKey: "mobile",
        header: "Mobile",
        // meta: {
        //   filterVariant: "mobile"
        // }
      },
      {
        accessorKey: "createdAt",
        header: "Create At",
        cell: (info) => <Created value={info.getValue()} />,
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <div className="div">
            <button onClick={() => handleEditClick(row.original)}>Edit</button>{" "}
            <span>/</span>
            <button onClick={() => handleDelete(row.original._id)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleEditClick = (data) => {
    navigate(`/editform/${data._id}`, { state: data });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        // setLoading(true)
        await axios.delete(`http://localhost:8000/emp/deleteEmp/${id}`, {
          headers: {
            Authorization: `Bearer ${details.token}`,
          },
        });
        // Remove the deleted employee from the state
        const filterdata = data.filter((employee) => employee._id !== id);
        setData(filterdata);
        setRender(!render);
        alert("Employee deleted successfully");
        // setLoading(false)
      } catch (error) {
        console.error(error);
        alert("Failed to delete employee");
      }
    }
  };

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
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [details.token, render]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  // if (data.length === 0) return <div>No employees found.</div>;

  return (
    <>
   <div className="employees-table-container p-2">
      <div className="table-heading">
        <h2>Employess</h2>
        <button>

          <Link to="/empform"> Create Employee</Link>
        </button>
      
        {/* <h2>{details.username}</h2> */}
      </div>
      {
     
      data.length > 0 ?   <Table columns={columns} data={data} /> : (
        <div className="nodata">

          <h2>NO DATA FOUND</h2>
        </div>)
      }

    </div>
    <>
    
    </>
    </>


  )
}

export default Employees;
