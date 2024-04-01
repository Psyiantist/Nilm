const description = 'This command plays a song from Youtube Music.';
const usage = '(Songname - Author)';
const type = '1';
const YoutubeMusicApi = require('youtube-music-api');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const songapi = new YoutubeMusicApi();

const event = JSON.parse(process.argv[2]);
const msg = event.body;
let param = msg.split(" ").slice(1).join(" ");

songapi.initalize()
  .then(() => songapi.search(param, 'video'))
  .then(async (result) => {
    let songs = '';
    const videoId = result.content[0].videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const info = await ytdl.getInfo(url);

    if (info.videoDetails.lengthSeconds > 1200) {
      console.error(info.videoDetails);
      console.log(`Error: Media's length is too long.`);
      process.exit(0);
    }

    const stream = ytdl(url, {
      quality: "lowest"
    });

    const outputFilePath = path.join('./cache', `${event.senderID}.mp3`);

    ffmpeg()
      .input(stream)
      .audioBitrate(192)
      .on('end', () => {
        console.log(JSON.stringify({
          "body": info.videoDetails.title,
          "attachment": outputFilePath
        }));
      })
      .save(outputFilePath);
  })
  .catch((e) => {
    console.error(e)
    console.log(`Error: Cannot Find ${param} on Youtube.`);
  });
