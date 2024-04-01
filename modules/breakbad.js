const description = 'This command sends a random qoutes from movie "BREAKING BAD"';
const type = '1';

async function main() {
const axios = require("axios");
const response = await axios.get('https://api.breakingbadquotes.xyz/v1/quotes');
                    const { author, quote } = response.data[0];
          console.log(quote + `\n\n-` + author)
}

main()