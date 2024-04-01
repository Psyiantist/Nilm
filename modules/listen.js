const axios = require('axios');
const fs = require('fs');
const fetch = require('node-fetch');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const description = 'This command will turn your voice messages into text.';
const type = '4';
const event = JSON.parse(process.argv[2]);
const msg = event.body;

async function downloadAudio(url, filename) {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(fs.createWriteStream(filename));

  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    });

    response.data.on('error', (err) => {
      reject(err);
    });
  });
}

async function convertToFlac(inputFilename, outputFilename) {
  // Use FFmpeg to convert MP3 to FLAC
  const command = `ffmpeg -i ${inputFilename} -y ${outputFilename}`;
  await exec(command);
}

async function query(filename) {
  const data = fs.readFileSync(filename);

const response = await fetch(
		"https://api-inference.huggingface.co/models/openai/whisper-large-v2",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: data,
		}
	);
  
  const result = await response.json();
  return result;
}

async function main() {
  if (
    event.messageReply &&
    event.messageReply.attachments &&
    event.messageReply.attachments[0].type === 'audio'
  ) {
    if (event.messageReply.attachments.length !== 1) {
      console.error('This command is for 1 audio attachment only.');
    } else {
      const audioUrl = event.messageReply.attachments[0].url;
      const mp3Filename = `./cache/${event.senderID}.mp3`;
      const flacFilename = `./cache/${event.senderID}.flac`;

      try {
        await downloadAudio(audioUrl, mp3Filename);
        await convertToFlac(mp3Filename, flacFilename);

        query(flacFilename).then((response) => {
          console.log(response.text);
        });
      } catch (error) {
        console.error('Error downloading, converting, or processing audio:', error);
      }
    }
  } else {
    console.log('Reply to a voice message to convert it into text.');
  }
}

main();
