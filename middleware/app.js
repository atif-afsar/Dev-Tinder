const express = require("express");
const { connectDB } = require("../config/database");
const User = require("../models/user"); // ✅ Declare FIRST
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Atif",
    lastName: "Afsar",
    emailId: "atif@gmail.com",
    password: "atif@123",
  });

  await user.save();
  res.send("User added successfully");
});

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
