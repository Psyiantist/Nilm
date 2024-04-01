const axios = require('axios');
const Jimp = require('jimp');
const request = require('request');
const fs = require('fs');

const description = 'Retrieves info of user.';
const usage = '(username)';
const type = '3';

const event = JSON.parse(process.argv[2]);
const msg = event.body;
const username = msg.substring(msg.indexOf(" ") + 1);
var response = '';

const apiUrl = `https://api.popcat.xyz/github/${encodeURI(username)}`;

async function banner(imgPath) {
  try {
    const link = request(encodeURI(response.data.avatar));
    await new Promise((resolve, reject) => {
      link.pipe(fs.createWriteStream(`./cache/${event.senderID}avatar.jpg`))
          .on('finish', resolve)
          .on('error', reject);
  });

    const avatar = await Jimp.read(`./cache/${event.senderID}avatar.jpg`);
    avatar.resize(343, 343);
    avatar.circle();

    const image = await Jimp.read(imgPath);
    const newimage = new Jimp(1557, 780, 0x0);

    const font = await Jimp.loadFont('templates/fonts/hackout.fnt'); 
    const hugefont = await Jimp.loadFont('templates/fonts/hackouthuge.fnt');
    
    await newimage.print(font, 838, 304, response.data.location);
    await newimage.print(font, 788, 342, response.data.email);
    await newimage.print(font, 828, 378, response.data.twitter);
    await newimage.print(font, 881, 455, response.data.public_repos);
    await newimage.print(font, 889, 492, response.data.public_gists);
    await newimage.print(font, 768, 625, response.data.blog);
    await newimage.print(hugefont, 9, 557, {
      text: response.data.name,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, 474, 79);
    await newimage.print(font, 1045, 104, {
      text: response.data.bio,
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_TOP,
    }, 363, 129);

    
    await newimage.color([{ apply: 'xor', params: ['#5104c7'] }]);

    image.blit(newimage, 0, 0);
    image.composite(avatar, 104, 87, { mode: Jimp.BLEND_SOURCE_OVER });
    
    const outputPath = `./cache/${event.senderID}github.jpg`;
    await image.writeAsync(outputPath);

    console.log(JSON.stringify({
      "attachment": `./cache/${event.senderID}github.jpg`
    }));

    fs.unlinkSync(`./cache/${event.senderID}avatar.jpg`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

async function main() {
    response = await axios.get(apiUrl);
    await banner('./templates/github.jpg');
}

main();