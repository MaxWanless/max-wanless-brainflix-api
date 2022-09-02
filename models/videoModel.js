const fs = require("fs");

//Read data model
const fetchVideoList = () => {
  let videoList = JSON.parse(fs.readFileSync("./data/video-details.json"));
  return videoList;
};

//Write data model
const writeVideoData = (data) => {
  fs.writeFileSync("./data/video-details.json", JSON.stringify(data));
};

module.exports = { fetchVideoList, writeVideoData };
