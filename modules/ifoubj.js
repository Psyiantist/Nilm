const description = 'Sends a random hentai nsfw image based on tag.';
const usage = '(tag)';
const type = '669';
const akaneko = require('akaneko');
const axios = require('axios');
const fs = require('fs');

const event = JSON.parse(process.argv[2]);
const msg = event.body;
var tag = msg.substring(msg.indexOf(" ") + 1);
var link = '';

async function downloadFile(url, path) {
  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(fs.createWriteStream(path));
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    });
    response.data.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  switch (tag) {
    case 'ass':
      link = await akaneko.nsfw.ass();
      break;
    case 'bdsm':
      link = await akaneko.nsfw.bdsm();
      break;
    case 'blowjob':
      link = await akaneko.nsfw.blowjob();
      break;
    case 'cum':
      link = await akaneko.nsfw.cum();
      break;
    case 'doujin':
      link = await akaneko.nsfw.doujin();
      break;
    case 'femdom':
      link = await akaneko.nsfw.femdom();
      break;
    case 'gifs':
      link = await akaneko.nsfw.gifs();
      break;
    case 'glasses':
      link = await akaneko.nsfw.glasses();
      break;
    case 'hentai':
      link = await akaneko.nsfw.hentai();
      break;
    case 'maid':
      link = await akaneko.nsfw.maid();
      break;
    case 'masturbation':
      link = await akaneko.nsfw.masturbation();
      break;
    case 'panties':
      link = await akaneko.nsfw.panties();
      break;
    case 'pussy':
      link = await akaneko.nsfw.pussy();
      break;
    case 'school':
      link = await akaneko.nsfw.school();
      break;
    case 'succubus':
      link = await akaneko.nsfw.succubus();
      break;
    case 'tentacles':
      link = await akaneko.nsfw.tentacles();
      break;
    case 'thighs':
      link = await akaneko.nsfw.thighs();
      break;
    case 'yuri':
      link = await akaneko.nsfw.yuri();
      break;
    case 'help':
      console.log('Available tags: \n\nass, bdsm, blowjob, cum, doujin, femdom, gifs, glasses, hentai, maid, masturbation, panties, pussy, school, succubus, tentacles, thighs, yuri\n\nExample usage: /ifoubj blowjob');
      process.exit(0);
    default:
      console.log('Invalid command. Use "/ifoubj help" to see available tags.');
      process.exit(1);
  }
  
  const cachePath = './cache';
 
  const extension = link.endsWith('.gif') ? 'gif' : 'jpg';
  const fileName = `${event.senderID}_${tag}.${extension}`;
  const filePath = `${cachePath}/${fileName}`;
  await downloadFile(link, filePath);
  console.log(JSON.stringify({
    "attachment": filePath
    }));
}

main();