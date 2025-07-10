const express = require("express");
const { validateSignUpData } = require("../src/utils/validate");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../src/models/user"); // ✅ Declare FIRST
const jwt = require("jsonwebtoken");
authRouter.post("/signup", async (req, res) => {
  try{
    console.log("Request body:", req.body);

    validateSignUpData(req);
    console.log("Password before hashing:", password);


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

authRouter.post("/login", async (req,res) =>{
  try{
    const {emailId, password} = req.body;

    const user = await User.findOne({ emailId: emailId});
    if(!user){
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    

    if(isPasswordValid){

      const token = await jwt.sign({ _id: user._id}, "DEV@TINDER$790");
      res.cookie("token", token);
      res.send("Login successful");
      
     res.send("Login successful");;
    }else{
      throw new Error("Invalid Credentials");
    }
  }catch(err){
    res.status(400).send("ERROR: " + err.message);
  }
})


module.exports = authRouter;
