const description = 'This man speaking facts.';
const usage = '(text)';
const type = '1';

const axios = require('axios');
const fs = require('fs');

const event = JSON.parse(process.argv[2]);
const msg = event.body;
const text = msg.substring(msg.indexOf(" ") + 1);


const link = `https://api.popcat.xyz/facts?text=${encodeURI(text)}`;
const imagePath = `./cache/${event.senderID}.jpg`;

axios({
  method: 'get',
  url: link,
  responseType: 'stream'
})
  .then(function (response) {
    response.data.pipe(fs.createWriteStream(imagePath))
      .on('finish', function () {
        console.log(JSON.stringify({
            "attachment": imagePath
          }));
      });
  })
  .catch(function (error) {
    console.error('Error downloading image:', error);
  });