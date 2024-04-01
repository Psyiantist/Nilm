const fs = require('fs');
const request = require('request');
const Jimp = require('jimp');

const description = 'This command generates a fake facebook login image.';
const usage = '(mention)';
const type = '1';

const event = JSON.parse(process.argv[2]);
const msg = event.body;

async function generateFakeImage() {
    if (!event.mentions || Object.keys(event.mentions).length === 0) {
        console.log("Error: You need to mention someone from the group.");
        process.exit(1);
    }

    let id = Object.keys(event.mentions);
    let name = Object.values(event.mentions)[0];
    name = name.substring(1);
    let pfp = request(encodeURI(`https://graph.facebook.com/${id[0]}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`));

    await new Promise((resolve, reject) => {
        pfp.pipe(fs.createWriteStream(`./cache/${event.senderID}pfp.jpg`))
            .on('finish', resolve)
            .on('error', reject);
    });

    pfp = await Jimp.read(`./cache/${event.senderID}pfp.jpg`);
    pfp.resize(118, 121);

    const image = await Jimp.read(`./templates/hack.jpg`);
    const textImage = new Jimp(1000, 1000, 0x0);

    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    textImage.print(font, 235, 557, name);
    textImage.color([{ apply: 'xor', params: ['#1977f3'] }]);

    image.blit(textImage, 0, 0);
    image.composite(pfp, 90, 512, { mode: Jimp.BLEND_SOURCE_OVER });

    await image.writeAsync(`./cache/${event.senderID}.jpg`);

    console.log(JSON.stringify({
        "attachment": `./cache/${event.senderID}.jpg`
    }));
}

generateFakeImage().catch(error => {
    console.error("An error occurred:", error);
    process.exit(1);
});
