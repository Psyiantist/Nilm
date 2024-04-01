const description = 'A game where the player needs to guess the mixed/scrambled word.';
const type = '1';
const event = JSON.parse(process.argv[2]);
const fs = require('fs');

function readFile(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return data.trim().split('\n');
  } catch (err) {
    console.error(err);
    return null;
  }
}

function scrambleString(inputString) {
  const charArray = inputString.split('');
  for (let i = charArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [charArray[i], charArray[j]] = [charArray[j], charArray[i]];
  }
  const scrambledString = charArray.join('');
  return scrambledString;
}

function writeFile(string, txtFilePath) {
  fs.writeFile(txtFilePath, string, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
}

const wordlist = readFile('templates/wordlist.txt');
const word = wordlist[Math.floor(Math.random() * wordlist.length)];
const scrambledword = scrambleString(word);
writeFile(word, `./cache/${scrambledword}.txt`);

console.log(`WordMix Game.\n\nGuess this word: ${scrambledword}\n\nReply the answer on this message.`);