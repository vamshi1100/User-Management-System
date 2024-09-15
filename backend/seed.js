const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admins = require("./models/admin");

mongoose
  .connect("mongodb://localhost:27017/usermanagement1")
  .then(() => {
    console.log("mongo connection open");
  })
  .catch((err) => {
    console.log("oh no mongo connection error");
    console.log(err);
  });

const username = "123";
const plainPassword = "123";

bcrypt.hash(plainPassword, 12, async (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  try {
    const admin = new Admins({ username, password: hash });
    await admin.save();
    console.log("Admin saved successfully");
  } catch (error) {
    console.error("Error saving admin:", error);
  }
});
