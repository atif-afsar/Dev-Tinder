const express = require("express");
const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";


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
    }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);



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
    const loggedInUser = req.user;   // user who is logged in (from userAuth middleware)

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // limit = limit > 50 ? 50 : limit;  // max limit is 50
    const skip = (page - 1) * limit;

   // 1. Find all connection requests where the loggedInUser is either sender or receiver
    const connectionRequests = await connectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ]
    }).select("fromUserId toUserId ");


  // 2. Prepare a set of users to HIDE from the feed
    const hideUserFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId);
      hideUserFromFeed.add(request.toUserId);
    });

    // 3. Get all users who are NOT in hideUserFromFeed and not the loggedInUser
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },  //   not in requests
        { _id: { $ne: loggedInUser._id } }   // not himself
      ]
    }).select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

      res.send(users);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

module.exports = userRouter; 