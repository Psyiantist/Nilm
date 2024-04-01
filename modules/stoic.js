const description = 'This command gives random stoicism quotes.';
const type = '0';
const fetch = require('node-fetch');

// Make a GET request to the API
fetch('https://stoic-quotes.com/api/quote')
  .then(response => response.json())
  .then(data => {
    console.log(`${data.text}
    
-${data.author}`);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
