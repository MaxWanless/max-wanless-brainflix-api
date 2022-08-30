const express = require("express");
const app = express();
require("dotenv").config();
const videosRoute = require("./routes/videos");
const { PORT, BACKEND_URL } = process.env;
const cors = require("cors");

//Cors middleware
app.use(cors());

// required to accces the body
app.use(express.json());

// Middleware to serve up static files
app.use("/endpoint-files", express.static("./public/images"));

//Call videos route
app.use("/videos", videosRoute);

app.listen(8080, () => {
  console.log("Running");
});
