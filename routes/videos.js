const express = require("express");
const router = express.Router();
const fs = require("fs");
const videosData = require("../data/videos.json");
const videosDetailData = require("../data/video-details.json");
const { response } = require("express");
const { error } = require("console");

router.get("/", (req, res) => {
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

router.get("/:id", (req, res) => {
  const currentVideo = videosDetailData.find(
    (video) => video.id == req.params.id
  );
  if (currentVideo) {
    res.json(currentVideo);
  } else {
    res.status(400).json("Video not found");
  }
});

module.exports = router;
