const express = require("express");
const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

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

module.exports = userRouter;