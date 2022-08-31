const { Console } = require("console");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const filter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 30 },
  fileFilter: filter,
});

// Return Video List endpoint
router
  .route("/")
  .get(function (req, res) {
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
  })
  .post(upload.single("thumbnailImage"), function (req, res) {
    console.log(req.file.originalname);
    let videosDetailList = JSON.parse(
      fs.readFileSync("./data/video-details.json")
    );
    let newVideo = {
      title: req.body.title,
      channel: "Bing Bong",
      image: `http://localhost:8080/endpoint-files/${req.file.originalname}`,
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

module.exports = router;
