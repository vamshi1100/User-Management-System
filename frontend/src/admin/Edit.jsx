import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Admindisplay.css";

const Edit = () => {
  const { id } = useParams();
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
  const [existingImage, setExistingImage] = useState(null); // For the image preview

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/edit/${id}`);
        const data = response.data;

        setFormData({
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          designation: data.designation || "",
          gender: data.gender || "",
          course: data.course || [],
          image: null, // No file by default
        });

        setExistingImage(data.image); // Store the existing image path for preview
      } catch (error) {
        console.error(
          "Error fetching employee data:",
          error.response ? error.response.data : error.message
        );
        alert(
          "Failed to fetch employee data: " +
          (error.response ? error.response.data.message : error.message)
        );
      }
    };

    fetchEmployeeData();
  }, [id]);

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
      setExistingImage(URL.createObjectURL(e.target.files[0])); // Preview the new file
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const tempErrors = {};

    if (formData.name.trim() && !/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      tempErrors.name = "Name should only contain letters and spaces";
    }

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      tempErrors.email = "Email is invalid";
    }

    if (formData.mobile.trim() && !/^\d{10}$/.test(formData.mobile.trim())) {
      tempErrors.mobile = "Mobile number must be 10 digits";
    }

    if (formData.image) {
      const fileType = formData.image.type;
      if (!["image/jpeg", "image/png"].includes(fileType)) {
        tempErrors.image = "Only jpg/png files are allowed";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "course") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key !== "image" || formData.image) {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (!formData.image) {
      // If no new image is uploaded, pass the existing image path
      formDataToSend.append("image", existingImage);
    }

    try {
      await axios.put(`http://localhost:3002/edit/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Data updated successfully");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data");
    }
  };

  return (
    <div className="containeredit">
      <h2>Edit Employee</h2>

      <form onSubmit={handleSubmit}>
        {["name", "email", "mobile"].map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type={field === "email" ? "email" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
            {errors[field] && <p className="error">{errors[field]}</p>}
          </div>
        ))}

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
          {errors.designation && <p className="error">{errors.designation}</p>}
        </div>

        <div>
          <label>Image Upload:</label>
          <input type="file" name="image" onChange={handleChange} />
          {existingImage && (
            <div>
              <img
                src={existingImage.includes("http") ? existingImage : `http://localhost:3002/${existingImage}`}
                alt="Current Image"
                style={{ width: "100px", height: "100px" }}
              />
            </div>
          )}
          {errors.image && <p className="error">{errors.image}</p>}
        </div>

        <button type="submit">Submit</button>
        <button type="button">
          <Link to="/Userdisplay">User Display</Link>
        </button>
      </form>
    </div>
  );
};

export default Edit;
