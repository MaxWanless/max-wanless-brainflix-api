const videoModel = require("../models/videoModel");
const { v4: uuidv4 } = require("uuid");

const videoList = (req, res) => {
  let videos = videoModel.fetchVideoList();
  const videoList = videos.map((video) => {
    return {
      id: video.id,
      title: video.title,
      image: video.image,
      channel: video.channel,
    };
  });
  res.json(videoList);
};

const videoDetail = (req, res) => {
  let videos = videoModel.fetchVideoList();
  const currentVideo = videos.find((video) => video.id == req.params.id);
  if (currentVideo) {
    res.json(currentVideo);
  } else {
    res.status(400).json("Video not found");
  }
};

const videoComments = (req, res) => {
  let videos = videoModel.fetchVideoList();
  const currentVideo = videos.find((video) => video.id == req.params.id);
  if (currentVideo) {
    res.json(currentVideo.comments);
  } else {
    res.status(400).json("Video not found");
  }
};

const postComment = (req, res) => {
  let videos = videoModel.fetchVideoList();
  const currentVideo = videos.find((video) => video.id == req.params.id);
  let newComment = {
    name: req.body.name,
    comment: req.body.comment,
    likes: 0,
    timestamp: Date.now(),
    id: uuidv4(),
  };
  currentVideo.comments.push(newComment);
  videos.map((video) => {
    if (video.id === currentVideo.id) {
      return (video = currentVideo);
    }
  });
  videoModel.writeVideoData(videos);
  res.status(200).json(newComment);
};

const deleteComment = (req, res) => {
  let videos = videoModel.fetchVideoList();
  const currentVideo = videos.find((video) => video.id == req.params.id);
  const currentComment = currentVideo.comments.find(
    (comment) => comment.id == req.params.commentId
  );
  currentVideo.comments.splice(
    currentVideo.comments.indexOf(currentComment),
    1
  );
  videos.map((video) => {
    if (video.id === currentVideo.id) {
      return (video = currentVideo);
    }
  });
  videoModel.writeVideoData(videos);
  res.status(200).json(currentComment);
};

const likeComment = (req, res) => {
  let videos = videoModel.fetchVideoList();
  const currentVideo = videos.find((video) => video.id == req.params.id);
  const currentComment = currentVideo.comments.find(
    (comment) => comment.id == req.params.commentId
  );
  currentComment.likes = currentComment.likes + 1;
  videos.map((video) => {
    if (video.id === currentVideo.id) {
      return (video = currentVideo);
    }
  });
  videoModel.writeVideoData(videos);
  res.status(200).json(currentComment);
};

const postVideo = (req, res) => {
  let filename = "";
  if (req.file) {
    filename = req.file.originalname;
  } else {
    filename = "Upload-video-preview.jpg";
  }
  let videos = videoModel.fetchVideoList();
  let newVideo = {
    title: req.body.title,
    channel: "Bing Bong",
    image: `http://localhost:8080/endpoint-files/${filename}`,
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
  videos.push(newVideo);
  videoModel.writeVideoData(videos);
  res.json(newVideo);
};

module.exports = {
  videoList,
  videoDetail,
  videoComments,
  postComment,
  deleteComment,
  likeComment,
  postVideo,
};
