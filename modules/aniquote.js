const description = 'Sends a random quote from anime.';
const type = '1';
const animeQuotes = require('animequotes');

const quote = animeQuotes.randomQuote();

console.log(quote.quote + '\n\n-' + quote.name);