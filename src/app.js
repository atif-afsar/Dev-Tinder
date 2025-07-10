const express = require("express");
const { connectDB } = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/user"); // ✅ Declare FIRST
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const { validateSignUpData } = require("./utils/validate");
const app = express();

app.use(express.json()); //middleware given by express to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies


const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const requestRouter = require("../routes/requests");

app.use("/", authRouter);


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
