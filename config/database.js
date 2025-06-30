const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Nodejs:kplgFAXjetntI3My@cluster1.wkfp8.mongodb.net/HelloWorld");

};

module.exports = { connectDB };
