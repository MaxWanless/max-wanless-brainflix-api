const express = require("express");
const router = express.Router();
const fs = require("fs");
const { response } = require("express");
const { error } = require("console");
const { v4: uuidv4 } = require("uuid");

// Return Video List endpoint
router.get("/", (req, res) => {
  let videosData = JSON.parse(fs.readFileSync("./data/video-details.json"));
  const videoList = videosData.map((video) => {
    return {
      id: video.id,
      title: video.title,
      image: video.image,
      channel: video.channel,
    };
  });
  res.json(videoList);
});

//Return current video details endpoint
router.get("/:id", (req, res) => {
  let videosData = JSON.parse(fs.readFileSync("./data/video-details.json"));
  const currentVideo = videosData.find((video) => video.id == req.params.id);
  if (currentVideo) {
    res.json(currentVideo);
  } else {
    res.status(400).json("Video not found");
  }
});

//Static images endpoint


// Video upload endpoint
router.post("/newVideo", (req, res) => {
  console.log("hit");
  let videosDetailList = JSON.parse(
    fs.readFileSync("./data/video-details.json")
  );

  let newVideo = {
    title: req.body.title,
    channel: "Bing Bong",
    image: "http://localhost:8080/endpoint-files/Upload-video-preview.jpg",
    description: req.body.description,
    views: Math.floor(Math.random() * 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    likes: Math.floor(Math.random() * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    duration: "3:02",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp:  Date.now(),
    comments: [],
    id: uuidv4(),
  };
  videosDetailList.push(newVideo);
  fs.writeFileSync(
    "./data/video-details.json",
    JSON.stringify(videosDetailList)
  );
  res.json(newVideo);
});

module.exports = router;
