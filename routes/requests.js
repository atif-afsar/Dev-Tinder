const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../src/middleware/auth");




requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) =>{
    const user = rq.user;
    //sending a connection request
    console.log("sending a connection request");
} );

module.exports = requestRouter;