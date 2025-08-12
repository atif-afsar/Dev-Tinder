const express = require("express");
const { validateSignUpData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../models/user"); // ✅ Declare FIRST
const jwt = require("jsonwebtoken");


const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {
  try {
    // Destructure FIRST before using any variables
    const { firstName, lastName, emailId, password } = req.body;

    // Now you can log it
    console.log("Request body:", req.body);
    console.log("Password before hashing:", password);

    // Validate request
    validateSignUpData(req);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash)

    // Create user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
}); 
 
authRouter.post("/login", async (req,res) =>{
  try{
    const {emailId, password} = req.body;

    const user = await User.findOne({ emailId: emailId});
    if(!user){
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    

    if(isPasswordValid){
      // Create a Jwt Token 
      const token = await jwt.sign({ _id: user._id}, "DEV@TINDER$790");
      res.cookie("token", token);
      res.send("Login successful");
    }else{
      throw new Error("Invalid Credentials");
    }
  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
})

authRouter.post("/logout", async (req, res) =>{
  res.cookie("token", null, {
    expires : new Date(Date.now()),

  });
  res.send("Logout successful");
})

module.exports = authRouter;

   