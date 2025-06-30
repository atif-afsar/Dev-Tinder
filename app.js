const express = require("express");

const app = express();


app.get("/user", (req, res) => {
 next();
});
app.post("/user", (req, res) => {
 next();
});

app.delete("/user", (req, res) => {
 next();
});

app.patch("/user", (req, res) => {
  res.send("User updated successfully!");
});

app.use("/getUserData", (req, res, next) => {
  //logic of DB call and get user data 
})
throw new Error("This is an error!");
res.send("User data sent");

app.use("/error", (err, req, res, next) =>{
  if(err){
    // log the error
    res.status(500).send("Something went wrong!");
  }
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
