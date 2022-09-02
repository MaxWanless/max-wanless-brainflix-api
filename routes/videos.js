const express = require("express");
const multer = require("multer");
const router = express.Router();
const videoController = require("../controllers/videoControllers");

//create location to store uploaded image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
//Filter so only jpegs and pngs
const filter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//Create multer object to handle uploaded image
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 30 },
  fileFilter: filter,
});

//Video list endpoint
router
  .route("/")
  .get(videoController.videoList)
  .post(upload.single("image"), videoController.postVideo);

//Video details endpoint
router
  .route("/:id")
  .get(videoController.videoDetail)
  .put(videoController.likeVideo);

//Comment list endpoint
router
  .route("/:id/comments")
  .get(videoController.videoComments)
  .post(videoController.postComment);

//Comment details endpoint
router
  .route("/:id/comments/:commentId")
  .delete(videoController.deleteComment)
  .put(videoController.likeComment);

module.exports = router;
