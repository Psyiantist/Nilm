const description = 'Searches for porn video based on keyword.';
const usage = '(keyword)';
const type = '669';

const event = JSON.parse(process.argv[2]);
const msg = event.body;
var keyword = msg.substring(msg.indexOf(" ") + 1);

const xv = require('xvideos-scraper');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

async function download(link) {
  try {
    const response = await axios.head(link);
    const contentLength = response.headers['content-length'];

    const totalBytes = parseInt(contentLength, 10);
    const bytesToDownload = 8 * 1000000;

    const segmentStart = 0;
    const segmentEnd = Math.min(segmentStart + bytesToDownload, totalBytes);

    const filename = event.senderID + '.mp4';
    const cacheFolder = './cache/';

    const filePath = path.join(cacheFolder, filename);

    const { data } = await axios.get(link, {
      responseType: 'stream',
      headers: { Range: `bytes=${segmentStart}-${segmentEnd}` },
    });

    await pipeline(data, fs.createWriteStream(filePath));

    return filePath;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

async function main() {
  try {
    let searchResults = await xv.searchVideo({
      search: keyword,
      sort: 'relevance',
      pagination: 1,
    });

    if (searchResults.length > 0) {
      var videoUrl = searchResults[0].video;

      let videoData = await xv.getVideoData({
        proxy: true,
        videoUrl: videoUrl,
      });
      
      videoUrl = videoData.contentUrl;

      download(videoUrl)
        .then((filePath) => {
          console.log(JSON.stringify({
            "body": videoData.name,
            "attachment": filePath
          }));
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
    } else {
      console.log('No search results found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();