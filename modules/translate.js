const description = 'Translate given text to a specified language.';
const usage = '(language) (text)';
const type = '0';

const event = JSON.parse(process.argv[2]);
var msg = event.body;
const lang = msg.split(" ")[1];

if (msg.split(" ").length > 1) {
  const msgArray = msg.split(" ");
  msgArray.shift();
  msg = msgArray.join(" ");
} else {
  console.log('Syntax error.\n\nExample usage\n/translate english Mahal kita');
  process.exit(0);
}


const text = msg.substring(msg.indexOf(" ") + 1);

const axios = require('axios');

async function main() {
  const response = await axios.get(`https://api.popcat.xyz/translate?to=${encodeURI(lang)}&text=${encodeURI(text)}`);
  const data = response.data;

  if (data.message) {
    console.log(data.message);
    process.exit(0);
  }

  console.log(data.translated);
}

main();