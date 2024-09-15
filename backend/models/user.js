const mongoose = require("mongoose");

// Define the schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validates 10-digit mobile numbers
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
    enum: ["HR", "Manager", "Sales"], // Ensures that only specified values are allowed
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["M", "F"], // Ensures that only 'M' or 'F' is allowed
  },
  course: {
    type: [String],
    required: [true, "At least one course is required"],
    enum: ["MCA", "BCA", "BSC"], // Ensures that only specified values are allowed
  },
  image: {
    type: String,
    required: [true, "Image is required"], // Assuming you'll store the image as a URL or file path
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const Employee = mongoose.model("User", employeeSchema);

module.exports = Employee;
