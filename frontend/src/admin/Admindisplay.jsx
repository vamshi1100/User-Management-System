import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Admindisplay.css";

const Admindisplay = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [emailList, setEmailList] = useState(["existing@example.com"]); // Mock email list for duplicate check
  const [user, setUser] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        course: checked
          ? [...prev.course, value]
          : prev.course.filter((c) => c !== value),
      }));
    } else if (type === "file") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validation logic
  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    else if (emailList.includes(formData.email))
      tempErrors.email = "Email is already taken";
    if (!formData.mobile) tempErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      tempErrors.mobile = "Mobile number must be 10 digits";
    if (!formData.designation)
      tempErrors.designation = "Designation is required";
    if (!formData.gender) tempErrors.gender = "Gender is required";
    if (!formData.course.length)
      tempErrors.course = "At least one course must be selected";
    if (formData.image) {
      const fileType = formData.image.type;
      if (!["image/jpeg", "image/png"].includes(fileType)) {
        tempErrors.image = "Only jpg/png files are allowed";
      }
    } else {
      tempErrors.image = "Image upload is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Prevent submission if validation fails

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("mobile", formData.mobile);
    formDataToSend.append("designation", formData.designation);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("course", JSON.stringify(formData.course)); // Convert array to JSON string
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      await axios.post("http://localhost:3002/admindisplay", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Fetch user data after successful submission
      const response = await axios.get("http://localhost:3002/login", {
        withCredentials: true, // Include credentials to access protected routes
      });
      setUser(response.data);

      
      alert("Data submitted successfully");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        designation: "",
        gender: "",
        course: [],
        image: null,
      }); // Reset form
    } catch (error) {
      console.error(
        "Error details:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Error submitting data: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3002/login", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <img
          src={`http://localhost:3002/uploads/profile.jpg`}
          alt="Logo"
          className="logo"
        />
        <span>{user ? `Welcome, ${user.username}` : "not found user"}</span>

        <Link to="/logout">logout</Link>
      </div>

      <div>
        <h2>Create Employee</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p>{errors.name}</p>}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label>Mobile No:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <p>{errors.mobile}</p>}
        </div>

        <div>
          <label>Designation:</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.designation && <p>{errors.designation}</p>}
        </div>

        <div>
          <label>Gender:</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="M"
              checked={formData.gender === "M"}
              onChange={handleChange}
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="F"
              checked={formData.gender === "F"}
              onChange={handleChange}
            />{" "}
            Female
          </label>
          {errors.gender && <p>{errors.gender}</p>}
        </div>

        <div>
          <label>Course:</label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="MCA"
              checked={formData.course.includes("MCA")}
              onChange={handleChange}
            />{" "}
            MCA
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="BCA"
              checked={formData.course.includes("BCA")}
              onChange={handleChange}
            />{" "}
            BCA
          </label>
          <label>
            <input
              type="checkbox"
              name="course"
              value="BSC"
              checked={formData.course.includes("BSC")}
              onChange={handleChange}
            />{" "}
            BSC
          </label>
          {errors.course && <p>{errors.course}</p>}
        </div>

        <div>
          <label>Image Upload:</label>
          <input type="file" name="image" onChange={handleChange} />
          {errors.image && <p>{errors.image}</p>}
        </div>

        <button type="submit">Submit</button>
        <button type="button">
          <Link to="/Userdisplay">User Display</Link>
        </button>
      </form>
    </div>
  );
};

export default Admindisplay;
