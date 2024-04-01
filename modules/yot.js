const description = 'This is a corrupted command (under construction).';
const type = '2';
const fs = require('fs');
const path = require('path');

const event = JSON.parse(process.argv[2]);
const msg = event.body;
var sin = msg.substring(msg.indexOf(" ") + 1);

const resultArray = [];

switch (sin) {
  case 'greed':
    resultArray.push('List of Greed Commands');
    sin = 667;
    break;
  case 'wrath':
    resultArray.push('List of Wrath Commands');
    sin = 668;
    break;
  case 'lust':
    resultArray.push('List of Lust Commands');
    sin = 669;
    break;
  default:
    console.log('This command is still under construction.');
    process.exit(0);
}

const modulesFolderPath = path.join('./modules');
const files = fs.readdirSync(modulesFolderPath);

files.forEach((file) => {
  const filePath = path.join(modulesFolderPath, file);

  // Check if it's a file before trying to read
  if (fs.statSync(filePath).isFile()) {
    const fileName = path.parse(file).name;
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const descriptionMatch = fileContent.match(/const\s+description\s+=\s+'(.*)';/);
    const usageMatch = fileContent.match(/const\s+usage\s+=\s+'(.*)';/);
    const typeMatch = fileContent.match(/const\s+type\s+=\s+'(.*)';/);

    if (typeMatch && typeMatch[1] === String(sin)) {
      const description = descriptionMatch ? descriptionMatch[1] : ' ';
      const usage = usageMatch ? usageMatch[1] : ' ';

      resultArray.push(`/${fileName} ${usage}\n${description}`);
    }
  }
});

const result = resultArray.join('\n\n');
console.log(result);
