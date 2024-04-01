const description = 'Sends a random meme from Reddit.';
const type = '1';

const event = JSON.parse(process.argv[2]);

const fs = require('fs');
const axios = require('axios');
const path = require('path');

const apiUrl = 'https://meme-api.com/gimme';
const cacheFolder = path.join('./cache');

if (!fs.existsSync(cacheFolder)) {
  fs.mkdirSync(cacheFolder);
}

async function fetchMeme() {
  try {
    const response = await axios.get(apiUrl);
    const memeData = response.data;

    const imageUrl = memeData.url;
    const title = memeData.title;
    const imagePath = path.join(cacheFolder, path.basename(imageUrl));

    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(imagePath, imageResponse.data);

    const result = {
      body: title,
      attachment: imagePath
    };

    console.log(JSON.stringify(result));
  } catch (error) {
    console.error('Error fetching meme:', error.message);
  }
}

fetchMeme();
