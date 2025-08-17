const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest"); // Capitalized for clarity

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["ignore", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json("Invalid status" + " " + status);
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json("User not found");
      }
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json("You cannot send a connection request to yourself");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json("Connection request already exists"); 
      }

      const newRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newRequest.save();

      res.json({
        message: req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });

      console.log("Sending a connection request");
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
