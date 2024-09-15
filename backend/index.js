const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

// Initialize Express app
const app = express();

// Middleware
app.use(methodOverride("_method"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Update with your React app's URL
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(bodyParser.json());

// Setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/usermanagement1")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Define models
const User = require("./models/user");
const Admins = require("./models/admin");

app.use(
  session({
    secret: "nice",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/sessions",
    }), // Adjust to your MongoDB URI
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Route to get user data
app.get("/login", isAuthenticated, async (req, res) => {
  try {
    const user = await Admins.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to handle user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Admins.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user._id; // Save user ID in session
      res.cookie("auth", "true", { httpOnly: true, maxAge: 3600000 }); // 1 hour
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.clearCookie("auth");
    res.status(200).json({ message: "Logout successful" });
  });
});

// Define routes
app.post("/admindisplay", upload.single("image"), async (req, res) => {
  try {
    const { name, email, mobile, course, designation, gender } = req.body;
    const image = req.file ? req.file.path : null; // Get image path if file uploaded
    const newUser = new User({
      name,
      email,
      mobile,
      course: JSON.parse(course), // Parse course array from JSON
      designation,
      gender,
      image,
    });

    await newUser.save();
    res.status(201).send("Data saved successfully");
  } catch (error) {
    console.error("Error details:", error); // Log full error details
    res.status(500).send("Internal Server Error");
  }
});

// GET route to retrieve all users
app.get("/Userdisplay", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Send the users data as JSON
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET route to edit user details
app.get("/edit/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const employeeId = req.params.id;

    const updateData = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      designation: req.body.designation,
      gender: req.body.gender,
      course: req.body.course ? JSON.parse(req.body.course) : [],
    };

    if (req.file) {
      updateData.image = req.file.path; // Update image path if file is uploaded
    }

    const updatedEmployee = await User.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE route to delete a user
app.delete("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Serve static files (optional, if you have a public folder)
app.use(express.static(path.join(__dirname, "public")));

// Start the server
app.listen(3002, () => {
  console.log("App is listening on port 3002!");
});
