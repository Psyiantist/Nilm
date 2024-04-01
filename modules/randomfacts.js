const description = 'This command gives random facts.';
const type = '0';
const fetch = require('node-fetch');

// Make a GET request to the API
fetch('https://api.popcat.xyz/fact')
  .then(response => response.json())
  .then(data => {
    // Log the "fact" property from the response
    console.log(data.fact);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
