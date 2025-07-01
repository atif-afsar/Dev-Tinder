const express = require("express");
const { connectDB } = require("../config/database");
const User = require("../models/user"); // ✅ Declare FIRST
const app = express();

app.use(express.json()); //middleware given by express to parse JSON bodies

app.post("/signup", async (req, res) => {
  const user = new User(req.body)
  //   {
  //   firstName: "virat",
  //   lastName: "kohli",
  //   emailId: "virat@gmail.com",
  //   password: "virat@123",
  // });
   try{
  await user.save();
  res.send("User added successfully");
   }catch (err) {
    console.error("Error saving user:", err);
   }
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
