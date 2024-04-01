const description = 'This command gives random motivational quotes.';
const type = '0';
const https = require('https');

https.get('https://zenquotes.io/api/random', (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const quotes = JSON.parse(data);
    const quote = quotes[0];

    const formattedQuote = `${quote.q}\n\n-${quote.a}\n\n`;

    console.log(formattedQuote);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
