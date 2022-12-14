const express = require("express");
const app = express();
require("dotenv").config();
const videosRoute = require("./routes/videos");
const { PORT, BACKEND_URL } = process.env;
const cors = require("cors");

//Cors Middleware
app.use(cors());

// Middleware to accces the body
app.use(express.json());

// Middleware to serve up static files
app.use("/endpoint-files", express.static("./public/images"));
app.use("/endpoint-files", express.static("./public/videos"));

//Videos route
app.use("/videos", videosRoute);

app.listen(8080, () => {
  console.log("Running on: " + PORT);
  console.log("URL: " + BACKEND_URL);
});
