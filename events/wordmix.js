const event = JSON.parse(process.argv[2]);
const fs = require('fs');

const regex = /Guess this word: (\w+)/;
const match = event.messageReply.body.match(regex);
var word  = '';

if (match && match[1]) {
  word = match[1];
}

const useranswer = event.body.toLowerCase();

if (fs.existsSync(`./cache/${word}.txt`)) {
  fs.readFile(`./cache/${word}.txt`, 'utf8', (err, rightanswer) => {
    if (err) {
    return;
    }
    if (rightanswer != useranswer) {
      console.log('Wrong answer! Try again.')
    } else {
      console.log('Correct! We are going to add a currency system in our bot soon. Please stay tuned.');
      fs.unlinkSync(`./cache/${word}.txt`);
    }
});
}