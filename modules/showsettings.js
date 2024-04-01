const fs = require('fs').promises;

const description = 'This command shows the settings of your groupchat.';
const type = '0';

let event = JSON.parse(process.argv[2]),
    msg = event.body;

    async function look(searchString, fileArray) {
      const results = [];
    
      for (const file of fileArray) {
        try {
          const fileContents = await fs.readFile(file, 'utf8');
          const found = fileContents.includes(searchString) ? "On" : "Off";
          results.push(found);
        } catch (error) {
          console.error(`Error reading file ${file}: ${error.message}`);
          results.push(false);
        }
      }
    
      return results;
    }

async function main() {
  
  const results = await look(event.threadID, [
        '././permissions/antiout.txt',
        '././permissions/antispam.txt',
        '././permissions/antiunsend.txt'
    ]);

    console.log(`GROUPCHAT'S SETTINGS

ANTIOUT: ${results[0]}
ANTISPAM: ${results[1]}
ANTIUNSEND: ${results[2]}
`);
}

main();