const description = 'Displays all commands.';
const usage = '(number)';
const type = '2';
const fs = require('fs');
const path = require('path');

async function main() {
const descarray = [['📜📚List of Educational Commands📜🎮'], ['📜📚List of Entertainment Commands📜🎮'], ['📜📚List of  Edutainment Commands📜🎮'], ['📜📚List of  DevTools📜🎮'], ['📜📚List of  AIs📜🎮']];
var additional = '/help 1\nShow all educational commands.\n/help 2\nShow all entertaiment commands.\n/help 3\nShow all edutainment commands.\n/help 4\nShow all DevTools.\n/help 5\nShow all AIs.';
descarray[-1] = ['📜📚List of All Commands📜🎮'];

descarray[666] = ["Welcome, little pig\nAbraham is your father, so dwell in vain and do not sleep.\n\n/yot greed - Feeling greedy? Try this.\n/yot wrath - Some gore n shit.\n/yot lust - Grind that meat!"];
descarray[667] = [];
descarray[668] = [];
descarray[669] = [];

    const event = JSON.parse(process.argv[2]);
    const msg = event.body;
    var number = msg.substring(msg.indexOf(" ") + 1);

    if ( number == 0x29a ) {
      additional = '.Pysiantist__-';
    }

const modulesFolder = './modules';

fs.readdir(modulesFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(modulesFolder, file);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const moduleContent = data.toString();
      const descriptionMatch = moduleContent.match(/const\s+description\s+=\s+'(.*)';/);
      const usageMatch = moduleContent.match(/const\s+usage\s+=\s+'(.*)';/);
      const typeMatch = moduleContent.match(/const\s+type\s+=\s+'(.*)';/);

      if (descriptionMatch && descriptionMatch[1]) {
        var usage = ' ', type = ' ';
        if (usageMatch && usageMatch[1]) {usage = usageMatch[1];}
        if (typeMatch && typeMatch[1]) {type = parseInt(typeMatch[1]);}
        const description = descriptionMatch[1];
        const fileName = path.parse(file).name;

        if (type != 667 && type != 668 && type != 669 ) {
        descarray[-1].push(`💻/${fileName} ${usage}\n${description}`);
        }
        
        descarray[type].push(`💻/${fileName} ${usage}\n${description}`);

        if (type == 2) {
          descarray[0].push(`💻/${fileName} ${usage}\n${description}`);
          descarray[1].push(`💻/${fileName} ${usage}\n${description}`);
        }

        if (type == 4) {
          descarray[0].push(`💻/${fileName} ${usage}\n${description}`);
          descarray[1].push(`💻/${fileName} ${usage}\n${description}`);
        }
      }

      if (file === files[files.length - 1]) {

        switch(number) {
          case "1": number = 0; break; //Educational
          case "2": number = 1; break; //Entertainment
          case "3": number = 2; break; //Edutainment
          case "4": number = 3; break; //DevTools
          case "5": number = 4; break; //AIs
          case "666": number = 666; break; // Darkside
          default: number = -1; break; //all
          };

        const descriptions = descarray[number].join('\n\n');
        
        console.log(descriptions + '\n\n\n\n' + additional);
      }
    });
  });
});
}

main();