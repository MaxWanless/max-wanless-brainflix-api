const fs = require("fs");

const fetchVideoList = () =>{
    let videoList = JSON.parse(fs.readFileSync("./data/video-details.json"));
    return videoList
}

module.exports = {fetchVideoList}