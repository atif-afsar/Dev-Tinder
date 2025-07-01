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
app.get("/user",async (req,res) =>{
  const userEmail = req.body.emailId;
  try{
    const user = await User.find ({ emailId : userEmail})
    if(user.length ===0){
      res.status(404).send("User not found");

    }else{
      res.send(user);
    }
  }catch (err){
    res.status(400).send("Something went wrong")
  }
});
 
// get all users

app.get("/feed", async (req, res) => {
  try{
    const user = await User.find({});
      res.send(user);
    
  }
  catch (err){
    res.send (400).send("Something went wrong")
  }
})
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
