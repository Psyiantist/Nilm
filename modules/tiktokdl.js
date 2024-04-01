const description = 'Downloads a tiktok video by link.';
const usage = '(link)';
const type = '1';

const event = JSON.parse(process.argv[2]);
const msg = event.body;
var link = msg.substring(msg.indexOf(" ") + 1);

const { v1 } = require("node-tiklydown");
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');

async function download(url, filePath) {
	try {
		const response = await axios({
			method: 'GET',
			url: url,
			responseType: 'arraybuffer'
		});

		const buffer = Buffer.from(response.data, 'binary');
		const convertedBuffer = await sharp(buffer).toFormat('jpeg').toBuffer();

		fs.writeFileSync(filePath, convertedBuffer);

		return filePath;
	} catch (error) {
		console.error(error);
	}
}

async function downloadvid(url, filePath) {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });
  
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
  
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
    }
  }

v1(link).then(async data => {
	if (data.video) {
		await downloadvid(data.video.noWatermark, `./cache/${event.senderID}TTDL.mp4`);
		console.log(JSON.stringify({
			"attachment": `./cache/${event.senderID}TTDL.mp4`
		}));
	} else if (data.images) {
			var count = 1;
		 if (!fs.existsSync(`./cache/${event.senderID}TTDL`)) {
		 fs.mkdirSync(`./cache/${event.senderID}TTDL`, { recursive: true });
		 } else return;
		
		for (const image of data.images) {
			const filePath = `./cache/${event.senderID}TTDL/${event.senderID}_${count}.jpg`;
			await download(image.url, filePath);
			count++;
		}
		console.log(JSON.stringify({
			"attachment": `./cache/${event.senderID}TTDL`
		}));
	}
});
