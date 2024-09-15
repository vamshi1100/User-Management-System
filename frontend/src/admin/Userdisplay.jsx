import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./userdisplay.css";

const Userdisplay = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [adminData, setAdminData] = useState(null); // State for admin data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch employee data
    axios
      .get("http://localhost:3002/Userdisplay", { withCredentials: true })
      .then((response) => {
        setEmployeeData(response.data); // Set the employee data to state
        setLoading(false); // Data fetched successfully
      })
      .catch((err) => {
        setError("Error fetching employee data"); // Handle errors
        setLoading(false);
        console.error(err);
      });

    // Fetch admin data
    axios
      .get("http://localhost:3002/login", { withCredentials: true }) // Adjust URL if needed
      .then((response) => {
        console.log("Admin Data Response:", response.data); // Log response to check structure
        setAdminData(response.data); // Set admin data to state
      })
      .catch((err) => {
        setError("Error fetching admin data"); // Handle errors
        console.error(err);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle delete
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3002/edit/${id}`, {
        withCredentials: true,
      });
      alert(response.data.message); // Show delete success message
      // Update state by removing the deleted employee from the list
      setEmployeeData(employeeData.filter((employee) => employee._id !== id));
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee.");
    }
  };

  return (
    <div className="user-display-container">
      <div className="header">
        <img
          src={`http://localhost:3002/uploads/profile.jpg`}
          alt="Logo"
          className="logo"
        />
        <h1>Employee List</h1>
        <div className="user-info">
          {adminData ? (
            <span>{adminData.username} -</span> // Display admin name or any other data
          ) : (
            <span>Loading Admin Data...</span>
          )}
          <a href="/">Logout</a>
        </div>
      </div>

      <div className="top-bar">
        <span>Employee List</span>
        <span>Total Count: {employeeData.length}</span>
        <input
          type="text"
          className="search-bar"
          placeholder="Enter Search Keyword"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Unique Id</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((employee) => (
            <tr key={employee._id}>
              <td>{employee._id}</td>
              <td>
                <img
                  src={`http://localhost:3002/${employee.image}`}
                  alt="Employee"
                  className="employee-img"
                />
              </td>
              <td>{employee.name}</td>
              <td>
                <a href={`mailto:${employee.email}`} className="email-link">
                  {employee.email}
                </a>
              </td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.course}</td>
              <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="action-link">
                  <Link to={`/edit/${employee._id}`}>Edit</Link>
                </button>

                <button
                  style={{ color: "white" }}
                  className="action-link"
                  onClick={() => handleDelete(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Userdisplay;
