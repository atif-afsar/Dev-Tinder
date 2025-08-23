const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // reference to the User model
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum:{
                values: ["ignore", "interested", "accepted", "rejected"],
                message: `{VALUE} is not a valid status type`,
            },
            
        },
    },
    {
        timestamps: true,
    } 

);

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 },);

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
