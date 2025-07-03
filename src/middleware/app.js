const express = require("express");
const { connectDB } = require("../config/database");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // ✅ Declare FIRST
const { validateSignUpData } = require("../utils/validate");
const app = express();

app.use(express.json()); //middleware given by express to parse JSON bodies

app.post("/signup", async (req, res) => {
  try{
    console.log("Request body:", req.body);

    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User created successfully");
  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
});
// app.get("/user",async (req,res) =>{
//   const userEmail = req.body.emailId;
//   try{
//     const user = await User.find ({ emailId : userEmail})
//     if(user.length ===0){
//       res.status(404).send("User not found");

//     }else{
//       res.send(user);
//     }
//   }catch (err){
//     res.status(400).send("Something went wrong")
//   }
// });
 
// // get all users

// app.get("/feed", async (req, res) => {
//   try{
//     const user = await User.find({});
//       res.send(user);
    
//   }
//   catch (err){
//     res.send (400).send("Something went wrong")
//   }
// })

// // deleting by id 
// app.delete("/delete", async (req, res) => {
//   const userId = req.body.userId;

//   try {
//     const user = await User.findByIdAndDelete(userId);

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     res.send("User deleted successfully");
//   } catch (err) {
//     console.error(err);
//     res.status(400).send("Something went wrong");
//   }
// });

// app.patch("/update/:emailId", async (req, res) => {
//   const emailId = req.params?.emailId;
//   const data = req.body;

//   const ALLOWED_UPDATES = ["firstName", "lastName", "emailId", "password"];
//   const isUpdateAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));

//   if (!isUpdateAllowed) {
//     return res.status(400).json({ error: "Invalid update request" });
//   }

//   try {
//     const user = await User.findOneAndUpdate(
//       { emailId: emailId },
//       { $set: data },
//       { new: true, runValidators: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error) {
//     res.status(500).json({ error: "Server error", details: error.message });
//   }
// });


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
