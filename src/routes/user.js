const express = require("express");
const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");


userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const connectionRequests = await connectionRequest.find({
          toUserId: loggedInUser._id,
          status: "interested",
      }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","skills"]);
 

      res.json({
        message: "Data received successfully",
        data: connectionRequests
      })


    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const connectionRequests = await connectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" }
      ]
    }).populate("fromUserId", USER_SAVE_DATA).populate("toUserId", USER_SAVE_DATA);



    const data = connectionRequests.map((row) =>{ 
      if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return row.toUserId;  
      }
      return row.fromUserId;
    });

    res.json({
      message: "Data received successfully", 
      data: connectionRequests
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

userRouter.get("/feed", userAuth, async (req,res) =>{
  try{
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ]
    }).select("fromUserId toUserId ");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId);
      hideUserFromFeed.add(request.toUserId);
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    }).select(USER_SAVE_DATA);
      res.send(users);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

module.exports = userRouter; 