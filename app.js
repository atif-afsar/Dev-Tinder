const express = require("express");

const app = express();


app.get("/user", (req, res) => {
  res.send("Hello, User!");
});
app.post("/user", (req, res) => {
  res.send("User created successfully!");
});

app.delete("/user", (req, res) => {
  res.send("User deleted successfully!");
});

app.patch("/user", (req, res) => {
  res.send("User updated successfully!");
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
