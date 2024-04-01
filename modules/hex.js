const description = 'Retrieves info of a hex.';
const usage = '(hex)';
const type = '3';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');

let event = JSON.parse(process.argv[2]),
	msg = event.body,
	hexCode = msg.substring(msg.indexOf(" ") + 1);


  async function downloadImage(link) {
    try {
      // Fetch SVG content
      const response = await axios.get(link, { responseType: 'text' });
      const svgContent = response.data;
  
      // Convert SVG to PNG using sharp
      const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();
  
      // Create cache folder if it doesn't exist
      const cacheFolder = path.join('./cache');
      if (!fs.existsSync(cacheFolder)) {
        fs.mkdirSync(cacheFolder);
      }
  
      // Generate a unique file name
      const fileName = `${event.sender}prev.png`;
      const filePath = path.join(cacheFolder, fileName);
  
      // Save PNG to cache folder
      fs.writeFileSync(filePath, pngBuffer);
  
      return filePath;
    } catch (error) {
      console.error('Error downloading and converting SVG to PNG:', error);
      throw error;
    }
  }

  async function getColorInfo(hex) {
    try {
        const url = `http://www.thecolorapi.com/id?hex=${hex}`;
        const response = await axios.get(url);

        const colorData = response.data;

        if (colorData.code) {
            console.log(`'${hex}' is not a valid color hex code.`);
            process.exit(0);
        }

        const colorInfo = {
          hex: colorData.hex.value,
          name: colorData.name.value,
          rgb: `rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b})`,
          cmyk: `cmyk(${colorData.cmyk.c}, ${colorData.cmyk.m}, ${colorData.cmyk.y}, ${colorData.cmyk.k})`,
          xyz: `XYZ(${colorData.XYZ.X}, ${colorData.XYZ.Y}, ${colorData.XYZ.Z})`,
          img: colorData.image.named
        };

        return colorInfo;
    } catch (error) {
        console.error('Error fetching or parsing color data:', error);
        throw error;
    }
}


async function main() {
  
if (hexCode.startsWith('#')) {hexCode = hexCode.substring(1);}

const color = await getColorInfo(hexCode);
const imgPath = await downloadImage(color.img);

console.log(JSON.stringify({
  "body": `Color name: ${color.name}\n\nRGB Value: ${color.rgb}\nHex Value: ${color.hex}\nCMYK Value: ${color.cmyk}\nXYZ Value: ${color.xyz}`,
  "attachment": imgPath
}));
}

main();