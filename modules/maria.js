const description = 'Tagalog AI that is made originally by the owners.';
const usage = '(prompt)';
const type = '4';

const axios = require('axios');

let event = JSON.parse(process.argv[2]),
    msg = event.body,
    prompt = msg.substring(msg.indexOf(" ") + 1);

const postData = {
  system: `System: You are a tagalog AI named Maria created by Matt Castaneda, you will answer in Tagalog and in a feminine way and also short and concise.`,
  user: `${prompt}`
};

axios.post('https://kitsune.mattfawn.repl.co/norm', postData)
  .then(response => {
    console.log(response.data.response);
  })
  .catch(error => {
    console.error(error);
  });