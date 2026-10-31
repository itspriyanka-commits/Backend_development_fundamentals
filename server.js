const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// GET / - welcome text
app.get("/", (req, res) => {
  res.status(200).send("Welcome to my Node.js and Express Lab 1 server!");
});

// GET /about - student name and section as JSON
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "K.V.Sai Priyanka",
    section: "AIML IIB"
  });
});

// GET /time - current date and time
app.get("/time", (req, res) => {
  res.status(200).json({
    currentDateTime: new Date().toString()
  });
});

// Return 404 for every unknown path
app.use((req, res) => {
  res.status(404).send("404 - Route not found");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
