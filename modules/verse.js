const description = 'This command sends a random bible verse.';
const type = '1';

async function main() {
const axios = require("axios");
const response = await axios.get('https://labs.bible.org/api/?passage=random&type=json');
const { bookname, chapter, verse, text } = response.data[0];
console.log(`${bookname} ${chapter}:${verse}\n\n${text}`)
}

main();