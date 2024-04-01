const axios = require('axios');

const description = 'This command retrieves a song lyrics.';
const usage = '(song)';
const type = '0';

const event = JSON.parse(process.argv[2]);
const msg = event.body;
const song = msg.substring(msg.indexOf(" ") + 1);

const link = `https://api.popcat.xyz/lyrics?song=${encodeURI(song)}`;

axios.get(link)
  .then(response => {
    if (response.data.error) {
      console.log(response.data.error);
      return;
    }
    
    console.log(response.data.title + '\n\n' + response.data.lyrics);
  })
  .catch(error => {
    console.error(error);
  });