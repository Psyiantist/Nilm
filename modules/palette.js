const description = 'Creates a color palette based on hex color code.';
const usage = '(hex)';
const type = '3';

const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const event = JSON.parse(process.argv[2]);
const msg = event.body;
var hexColor = msg.substring(msg.indexOf(" ") + 1);

if (hexColor.startsWith('#')) hexColor = hexColor.substring(1);

async function palette(hex) {
  const apiUrl = `https://www.thecolorapi.com/scheme?format=json&named=false&hex=${hex}&count=4`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data.code) {
            console.log(`'${hex}' is not a valid color hex code.`);
            process.exit(0);
        }
    
    const colorPalette = response.data.colors.map(color => `${color.name.value}: ${color.hex.value}`);
    return colorPalette;
  } catch (error) {
    console.error('Error fetching color palette:', error.message);
    throw error;
  }
}

async function downloadImage(link) {
  try {
    const response = await axios.get(link, { responseType: 'text' });
    const svgContent = response.data;

    const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();

    const cacheFolder = path.join('./cache');
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder);
    }

    const fileName = `${event.sender}palette.png`;
    const filePath = path.join(cacheFolder, fileName);

    fs.writeFileSync(filePath, pngBuffer);

    return filePath;
  } catch (error) {
    console.error('Error downloading and converting SVG to PNG:', error);
    throw error;
  }
}

palette(hexColor)
  .then(async colors => {
    const palette = colors.join('\n');
    const img = await downloadImage(`https://www.thecolorapi.com/scheme?format=svg&named=false&hex=${hexColor}&count=4`);

    console.log(JSON.stringify({
      "body": palette,
      "attachment": img
    }));

  })
  .catch(error => {
    console.error('Palette function error:', error);
  });
