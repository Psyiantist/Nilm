const axios = require('axios');
const fs = require('fs');
const base64Img = require('base64-img');
const fetch = require('node-fetch');

const description = 'This command will identify the photo that you replied with.';
const type = '4';

const event = JSON.parse(process.argv[2]);
const msg = event.body;

async function query(filename) {
  const data = fs.readFileSync(filename);
  const result = data.toString('base64');
  return result;
}

if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0].type === "photo") {
  if (event.messageReply.attachments.length !== 1) {
    console.log('This command is for 1 image only.');
  } else {
    const imageUrl = event.messageReply.attachments[0].url;
    const senderID = event.senderID;

    axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream'
    })
    .then(async response => {
      const imageFilePath = `./cache/${senderID}.jpg`;
      const imageStream = fs.createWriteStream(imageFilePath);

      response.data.pipe(imageStream);

      imageStream.on('finish', async () => {

        query(imageFilePath).then(response => {
          console.log(response);
        });
      });

      imageStream.on('error', error => {
        console.error('Error writing image:', error);
      });
    })
    .catch(error => {
      console.error('Error downloading the image:', error);
    });
  }
} else {
  console.log('Reply this command to images, and it will identify the image.');
}
