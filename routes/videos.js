const { Console } = require("console");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Return Video List endpoint
router.get("/", (req, res) => {
  let videosData = JSON.parse(fs.readFileSync("./data/video-details.json"));
  const videoList = videosData.map((video) => {
    // video.comments.forEach((comment)=>{
    //   console.log(`"id"`+ ":" + `"${uuidv4()}",`)
    // })

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

//Comment get and post endpoint
router
  .route("/:id/comments")
  .get(function (req, res) {
    let videosData = JSON.parse(fs.readFileSync("./data/video-details.json"));
    const currentVideo = videosData.find((video) => video.id == req.params.id);
    if (currentVideo) {
      res.json(currentVideo.comments);
    } else {
      res.status(400).json("Video not found");
    }
  })
  .post(function (req, res) {
    let videosData = JSON.parse(fs.readFileSync("./data/video-details.json"));
    const currentVideo = videosData.find((video) => video.id == req.params.id);
    let newComment = {
      name: req.body.name,
      comment: req.body.comment,
      likes: 0,
      timestamp: Date.now(),
      id: uuidv4(),
    };
    currentVideo.comments.push(newComment);
    videosData.map((video) => {
      if (video.id === currentVideo.id) {
        return (video = currentVideo);
      }
    });
    fs.writeFileSync("./data/video-details.json", JSON.stringify(videosData));
    res.status(200).json(newComment);
  });

router
  .route("/:id/comments/:commentId")
  .delete(function (req, res) {
    let videosData = JSON.parse(fs.readFileSync("./data/video-details.json"));
    const currentVideo = videosData.find((video) => video.id == req.params.id);
    const currentComment = currentVideo.comments.find(
      (comment) => comment.id == req.params.commentId
    );

    currentVideo.comments.splice(
      currentVideo.comments.indexOf(currentComment),
      1
    );
    videosData.map((video) => {
      if (video.id === currentVideo.id) {
        return (video = currentVideo);
      }
    });
    fs.writeFileSync("./data/video-details.json", JSON.stringify(videosData));
    res.status(200).json(currentComment);
  })
  .put(function (req, res) {
    let videosData = JSON.parse(fs.readFileSync("./data/video-details.json"));
    const currentVideo = videosData.find((video) => video.id == req.params.id);
    const currentComment = currentVideo.comments.find(
      (comment) => comment.id == req.params.commentId
    );
    currentComment.likes = currentComment.likes + 1;
    videosData.map((video) => {
      if (video.id === currentVideo.id) {
        return (video = currentVideo);
      }
    });
    fs.writeFileSync("./data/video-details.json", JSON.stringify(videosData));
    res.status(200).json(currentComment);
  });

// Video Post endpoint
router.post("/newVideo", (req, res) => {
  let videosDetailList = JSON.parse(
    fs.readFileSync("./data/video-details.json")
  );
  let newVideo = {
    title: req.body.title,
    channel: "Bing Bong",
    image: "http://localhost:8080/endpoint-files/Upload-video-preview.jpg",
    description: req.body.description,
    views: Math.floor(Math.random() * 1000000)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    likes: Math.floor(Math.random() * 1000)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    duration: "3:02",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
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
